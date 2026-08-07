import request from 'supertest'
import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import z from 'zod'
import { DrizzleShortUrlRepository } from '@/adapters/secondary/db/DrizzleShortUrlRepository.ts'
import { ShortUrl } from '@/core/domain/entities/ShortUrl.entity.ts'
import { TargetUrl } from '@/core/domain/value-objects/target-url/TargetUrl.vo.ts'
import { Slug } from '@/core/domain/value-objects/slug/Slug.vo.ts'
import { IpAddress } from '@/core/domain/value-objects/ip-address/IpAddress.vo.ts'
import { sql } from 'drizzle-orm'
import { createTestApp } from '../helpers/createTestApp.ts'

const { app, db } = createTestApp()
const repo = new DrizzleShortUrlRepository(db)

// Public Slug Schema
const publicSlugSchema = z.object({
	slug: z.string(),
	originalUrl: z.url(),
	createdAt: z.iso.datetime().optional(),
	queryAt: z.iso.datetime(),
})

//Sleep Helper
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Insert test data before all tests
beforeAll(async () => {
	// 1. Create a public slug
	await repo.save(
		ShortUrl.reconstitute({
			id: '00000000-0000-0000-0000-000000000001',
			slug: Slug.reconstitute('public'),
			originalUrl: TargetUrl.reconstitute('https://www.google.com'),
			title: 'Google Public',
			purpose: 'direct',
			ipAddress: IpAddress.reconstitute({ ipAddress: '127.0.0.1' }),
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
			expiredAt: null,
			expirationDate: null,
		}),
	)

	// 2. Create a protected slug
	await repo.save(
		ShortUrl.reconstitute({
			id: '00000000-0000-0000-0000-000000000002',
			slug: Slug.reconstitute('protected'),
			originalUrl: TargetUrl.reconstitute('https://www.google.com'),
			title: 'Google Protected',
			purpose: 'direct',
			ipAddress: IpAddress.reconstitute({ ipAddress: '127.0.0.1' }),
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
			expiredAt: null,
			expirationDate: null,
		}),
	)

	// 3. Create an expired slug
	await repo.save(
		ShortUrl.reconstitute({
			id: '00000000-0000-0000-0000-000000000003',
			slug: Slug.reconstitute('expired'),
			originalUrl: TargetUrl.reconstitute('https://www.google.com'),
			title: 'Google Expired',
			purpose: 'direct',
			ipAddress: IpAddress.reconstitute({ ipAddress: '127.0.0.1' }),
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
			expiredAt: new Date(Date.now() - 10_000), // Expirado hace 10 segundos
			expirationDate: null,
		}),
	)

	// 4. Create a deleted slug (directly in DB since repo won't load deleted urls easily)
	await repo.save(
		ShortUrl.reconstitute({
			id: '00000000-0000-0000-0000-000000000004',
			slug: Slug.reconstitute('deleted'),
			originalUrl: TargetUrl.reconstitute('https://www.google.com'),
			title: 'Google Deleted',
			purpose: 'direct',
			ipAddress: IpAddress.reconstitute({ ipAddress: '127.0.0.1' }),
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: new Date(),
			expiredAt: null,
			expirationDate: null,
		}),
	)
})

afterAll(async () => {
	// Clean up by soft deleting
	const publicUrl = await repo.getUrlBySlug('public')
	if (publicUrl) {
		publicUrl.delete()
		await repo.save(publicUrl)
	}

	const protectedUrl = await repo.getUrlBySlug('protected')
	if (protectedUrl) {
		protectedUrl.delete()
		await repo.save(protectedUrl)
	}
})

describe('GET /internal/slug-data/:slug', () => {
	it('Should return the original URL if the slug exists', async () => {
		const response = await request(app)
			.get('/internal/slug-data/public')
			.set('Authorization', `Bearer ${process.env.INTERNAL_SECRET}`)
			.set(
				'User-Agent',
				'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
			)
			.set('Referer', 'https://t.co/abc')
			.set('X-Forwarded-For', '203.0.113.195')

		// 1. Check response status code and content type.
		expect(response.statusCode).toBe(200)
		expect(response.headers['content-type']).toBe(
			'application/json; charset=utf-8',
		)

		// 2. Check payload properties and their types.
		const parseResult = publicSlugSchema.safeParse(response.body)
		expect(parseResult.success).toBe(true)

		if (parseResult.success) {
			expect(parseResult.data.slug).toBe('public')
			expect(parseResult.data.originalUrl).toBe('https://www.google.com')
		}

		// 3. Check DB visit record persistence
		const visitRows = await db.execute(
			sql`SELECT * FROM visits WHERE short_url_id = '00000000-0000-0000-0000-000000000001'`,
		)
		expect(visitRows.rows.length).toBe(1)
		const visitRow = visitRows.rows[0]
		expect(visitRow.ip_address).toBe('203.0.113.195')
		expect(visitRow.browser).toBe('Safari')
		expect(visitRow.os).toBe('iOS')
		expect(visitRow.device).toBe('mobile')
		expect(visitRow.referer).toBe('https://t.co/abc')
		expect(visitRow.referer_domain).toBe('t.co')

		// 4. Check DB short_urls clicks_count increment
		const shortUrlRows = await db.execute(
			sql`SELECT clicks_count FROM short_urls WHERE id = '00000000-0000-0000-0000-000000000001'`,
		)
		expect(shortUrlRows.rows[0].clicks_count).toBe(1)
	})

	it('Should return 404 if the slug does not exist and NOT record a Visit', async () => {
		const response = await request(app)
			.get('/internal/slug-data/notexist')
			.set('Authorization', `Bearer ${process.env.INTERNAL_SECRET}`)

		expect(response.statusCode).toBe(404)
		expect(response.headers['content-type']).toBe(
			'application/json; charset=utf-8',
		)
		expect(response.body.code).toBe('SLUG_NOT_FOUND')
	})

	it('Should return 410 if the slug is expired and NOT record a Visit', async () => {
		const response = await request(app)
			.get('/internal/slug-data/expired')
			.set('Authorization', `Bearer ${process.env.INTERNAL_SECRET}`)

		expect(response.statusCode).toBe(410)
		expect(response.headers['content-type']).toBe(
			'application/json; charset=utf-8',
		)
		expect(response.body.code).toBe('SLUG_IS_EXPIRED')

		const visitRows = await db.execute(
			sql`SELECT * FROM visits WHERE short_url_id = '00000000-0000-0000-0000-000000000003'`,
		)
		expect(visitRows.rows.length).toBe(0)
	})

	it('Should return 410 if the slug is deleted and NOT record a Visit', async () => {
		const response = await request(app)
			.get('/internal/slug-data/deleted')
			.set('Authorization', `Bearer ${process.env.INTERNAL_SECRET}`)

		expect(response.statusCode).toBe(410)
		expect(response.headers['content-type']).toBe(
			'application/json; charset=utf-8',
		)
		expect(response.body.code).toBe('SLUG_IS_DELETED')

		const visitRows = await db.execute(
			sql`SELECT * FROM visits WHERE short_url_id = '00000000-0000-0000-0000-000000000004'`,
		)
		expect(visitRows.rows.length).toBe(0)
	})

	it('Should return 401 if the secret is missing', async () => {
		const response = await request(app).get('/internal/slug-data/public')
		expect(response.statusCode).toBe(401)
	})

	it('Should return 401 if the secret is invalid', async () => {
		const response = await request(app)
			.get('/internal/slug-data/public')
			.set('Authorization', 'Bearer invalid-secret')
		expect(response.statusCode).toBe(401)
	})

	describe('Verify persistence data', () => {
		it('Should do not update time in short_urls table if user visit the link', async () => {
			const shortUrl = await repo.getUrlBySlug('public')
			const initialTime = shortUrl?.updatedAt

			await sleep(50)

			const response = await request(app)
				.get('/internal/slug-data/public')
				.set('Authorization', `Bearer ${process.env.INTERNAL_SECRET}`)
				.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
				.set('X-Forwarded-For', '198.51.100.42')

			expect(response.statusCode).toBe(200)

			const updatedShortUrl = await repo.getUrlBySlug('public')
			expect(updatedShortUrl?.updatedAt.getTime()).toEqual(
				initialTime?.getTime(),
			)
		})
	})
})

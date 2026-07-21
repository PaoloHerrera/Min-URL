import request from 'supertest'
import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import { app } from '@/app.ts'
import z from 'zod'
import { DrizzleShortUrlRepository } from '@/adapters/secondary/db/DrizzleShortUrlRepository.ts'
import { ShortUrl } from '@/core/domain/entities/ShortUrl.entity.ts'
import { TargetUrl } from '@/core/domain/value-objects/target-url/TargetUrl.vo.ts'
import { Slug } from '@/core/domain/value-objects/slug/Slug.vo.ts'
import { IpAddress } from '@/core/domain/value-objects/ip-address/IpAddress.vo.ts'
import { Password } from '@/core/domain/value-objects/password/Password.vo.ts'

const repo = new DrizzleShortUrlRepository()

// Public Slug Schema
const publicSlugSchema = z.object({
	slug: z.string(),
	originalUrl: z.string().url().optional(),
	password: z.boolean().default(false),
	createdAt: z.string().datetime().optional(),
	queryAt: z.string().datetime(),
})

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
			passwordHash: null,
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
			passwordHash: Password.reconstitute('fakesalt:fakehash'),
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
			passwordHash: null,
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
			passwordHash: null,
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
	it('Should return the original URL and password false if the slug exists and not be protected by a password', async () => {
		const response = await request(app)
			.get('/internal/slug-data/public')
			.set('Authorization', `Bearer ${process.env.INTERNAL_SECRET}`)

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
			expect(parseResult.data.password).toBe(false)
		}
	})

	it('Should do not return the originalURL if the slug is protected by a password', async () => {
		const response = await request(app)
			.get('/internal/slug-data/protected')
			.set('Authorization', `Bearer ${process.env.INTERNAL_SECRET}`)

		// 1. Check response status code and content type.
		expect(response.statusCode).toBe(200)
		expect(response.headers['content-type']).toBe(
			'application/json; charset=utf-8',
		)

		// 2. Check payload properties and their types.
		const parseResult = publicSlugSchema.safeParse(response.body)
		expect(parseResult.success).toBe(true)
		if (parseResult.success) {
			expect(parseResult.data.slug).toBe('protected')
			expect(parseResult.data.password).toBe(true)
			expect(parseResult.data.originalUrl).toBeUndefined()
			expect(parseResult.data.createdAt).toBeUndefined()
		}
	})

	it('Should return 404 if the slug does not exist', async () => {
		const response = await request(app)
			.get('/internal/slug-data/notexist')
			.set('Authorization', `Bearer ${process.env.INTERNAL_SECRET}`)

		expect(response.statusCode).toBe(404)
		expect(response.headers['content-type']).toBe(
			'application/json; charset=utf-8',
		)
		expect(response.body.code).toBe('SLUG_NOT_FOUND')
	})

	it('Should return 410 if the slug is expired', async () => {
		const response = await request(app)
			.get('/internal/slug-data/expired')
			.set('Authorization', `Bearer ${process.env.INTERNAL_SECRET}`)

		expect(response.statusCode).toBe(410)
		expect(response.headers['content-type']).toBe(
			'application/json; charset=utf-8',
		)
		expect(response.body.code).toBe('SLUG_IS_EXPIRED')
	})

	it('Should return 410 if the slug is deleted', async () => {
		const response = await request(app)
			.get('/internal/slug-data/deleted')
			.set('Authorization', `Bearer ${process.env.INTERNAL_SECRET}`)

		expect(response.statusCode).toBe(410)
		expect(response.headers['content-type']).toBe(
			'application/json; charset=utf-8',
		)
		expect(response.body.code).toBe('SLUG_IS_DELETED')
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
})

import request from 'supertest'
import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import { app } from '../app.js'
import z from 'zod'
import { UrlModel } from '../src/adapters/secondary/db/models/Url.model.ts'
import { SlugModel } from '../src/adapters/secondary/db/models/Slug.model.ts'
import { sequelize } from '../config/database.js'

// define public and protected ids
let publicUrlId: string
let protectedUrlId: string

// Public Slug Schema
const publicSlugSchema = z.object({
	slug: z.string(),
	originalUrl: z.string().url().optional(),
	password: z.boolean().default(false),
	createdAt: z.string().datetime().optional(),
	queryAt: z.string().datetime(),
})

// Implement beforeAll to create a public and protected slug
beforeAll(async () => {
	// 1. Create a public URL
	const transaction = await sequelize.transaction()
	try {
		const publicURL = await UrlModel.create(
			{
				title: 'Google Public',
				long_url: 'https://www.google.com',
				purpose: 'direct',
				password: false,
			},
			{ transaction },
		)
		publicUrlId = publicURL.id_urls

		// Create 'public' slug
		await SlugModel.create(
			{
				slug: 'public',
				url_id: publicUrlId,
			},
			{ transaction },
		)

		// 2. Create a protected URL
		const protectedURL = await UrlModel.create(
			{
				title: 'Google Protected',
				long_url: 'https://www.google.com',
				purpose: 'direct',
				password: true,
			},
			{ transaction },
		)
		protectedUrlId = protectedURL.id_urls

		// 3. Create 'protected' slug
		await SlugModel.create(
			{
				slug: 'protected',
				url_id: protectedUrlId,
			},
			{ transaction },
		)
		await transaction.commit()
	} catch (error) {
		await transaction.rollback()
		throw new Error()
	}
})

// Delete the parent in UrlModel, Sequelize will delete the child in SlugModel
afterAll(async () => {
	if (publicUrlId) {
		await UrlModel.destroy({ where: { id_urls: publicUrlId } })
	}

	if (protectedUrlId) {
		await UrlModel.destroy({ where: { id_urls: protectedUrlId } })
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
			.set('Authorization', `Bearer ${process.env.INTERNAL_SECRETSECRET}`)

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

		// 1. Check response status code and content type.
		expect(response.statusCode).toBe(404)
		expect(response.headers['content-type']).toBe(
			'application/json; charset=utf-8',
		)
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

import { describe, expect, it, vi } from 'vitest'
import express from 'express'
import request from 'supertest'
import { errorHandler } from '@/adapters/primary/http/middlewares/errorHandler.middleware.ts'
import {
	SlugNotFoundError,
	SlugIsExpiredError,
	SlugIsDeletedError,
	SlugGenerationExhaustedError,
	InvalidUrlError,
} from '@/core/domain/errors/domain.errors.ts'

describe('errorHandler (Unit Test)', () => {
	let app: express.Express

	it('Should return 404 for SlugNotFoundError', async () => {
		app = express()
		app.get('/test', (req, res, next) => {
			next(new SlugNotFoundError('abc'))
		})
		app.use(errorHandler)

		const response = await request(app).get('/test')
		expect(response.status).toBe(404)
		expect(response.body).toEqual({
			code: 'SLUG_NOT_FOUND',
			message: 'Slug not found: abc',
		})
	})

	it('Should return 410 for SlugIsExpiredError', async () => {
		app = express()
		app.get('/test', (req, res, next) => {
			next(new SlugIsExpiredError('abc'))
		})
		app.use(errorHandler)

		const response = await request(app).get('/test')
		expect(response.status).toBe(410)
		expect(response.body).toEqual({
			code: 'SLUG_IS_EXPIRED',
			message: 'Slug is expired: abc',
		})
	})

	it('Should return 410 for SlugIsDeletedError', async () => {
		app = express()
		app.get('/test', (req, res, next) => {
			next(new SlugIsDeletedError('abc'))
		})
		app.use(errorHandler)

		const response = await request(app).get('/test')
		expect(response.status).toBe(410)
		expect(response.body).toEqual({
			code: 'SLUG_IS_DELETED',
			message: 'Slug is deleted: abc',
		})
	})

	it('Should return 503 for SlugGenerationExhaustedError', async () => {
		app = express()
		app.get('/test', (req, res, next) => {
			next(new SlugGenerationExhaustedError())
		})
		app.use(errorHandler)

		const response = await request(app).get('/test')
		expect(response.status).toBe(503)
		expect(response.body).toEqual({
			code: 'SLUG_GENERATION_EXHAUSTED',
			message: 'Error creating Short URL. Please try again later.',
		})
	})

	it('Should return 400 for generic DomainError (like InvalidUrlError)', async () => {
		app = express()
		app.get('/test', (req, res, next) => {
			next(new InvalidUrlError('invalid-url'))
		})
		app.use(errorHandler)

		const response = await request(app).get('/test')
		expect(response.status).toBe(400)
		expect(response.body).toEqual({
			code: 'INVALID_URL',
			message: 'Invalid URL: invalid-url',
		})
	})

	it('Should return 500 for non-domain generic errors', async () => {
		app = express()
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

		app.get('/test', (req, res, next) => {
			next(new Error('Something blew up'))
		})
		app.use(errorHandler)

		const response = await request(app).get('/test')
		expect(response.status).toBe(500)
		expect(response.body).toEqual({
			code: 'INTERNAL_SERVER_ERROR',
			message: 'An unexpected internal server error occurred.',
		})

		consoleSpy.mockRestore()
	})
})

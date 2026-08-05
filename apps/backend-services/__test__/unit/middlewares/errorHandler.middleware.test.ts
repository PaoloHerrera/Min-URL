import { describe, expect, it, vi } from 'vitest'
import express from 'express'
import request from 'supertest'
import { errorHandler } from '@/adapters/primary/http/middlewares/errorHandler.middleware.ts'
import {
	SlugNotFoundError,
	SlugIsExpiredError,
	SlugIsDeletedError,
	SlugGenerationExhaustedError,
	SlugAlreadyExistsError,
	InvalidUrlError,
} from '@/core/domain/errors/domain.errors.ts'
import {
	TooManyRequestsError,
	PayloadTooLargeError,
	CaptchaServiceError,
} from '@/adapters/errors/infra.errors.ts'
import { CaptchaVerificationError } from '@/core/errors/application.errors.ts'
import {
	SLUG_ERROR,
	VALIDATION_ERROR,
	SECURITY_ERROR,
	INFRA_ERROR,
} from '@min-url/contracts/errors'

describe('errorHandler (Unit Test)', () => {
	let app: express.Express

	it('Should return 404 for SlugNotFoundError', async () => {
		app = express()
		app.get('/test', (_req, _res, next) => {
			next(new SlugNotFoundError())
		})
		app.use(errorHandler)

		const response = await request(app).get('/test')
		expect(response.status).toBe(404)
		expect(response.body).toEqual({
			code: SLUG_ERROR.slugNotFound.code,
			message: SLUG_ERROR.slugNotFound.message,
		})
	})

	it('Should return 410 for SlugIsExpiredError', async () => {
		app = express()
		app.get('/test', (_req, _res, next) => {
			next(new SlugIsExpiredError())
		})
		app.use(errorHandler)

		const response = await request(app).get('/test')
		expect(response.status).toBe(410)
		expect(response.body).toEqual({
			code: SLUG_ERROR.slugIsExpired.code,
			message: SLUG_ERROR.slugIsExpired.message,
		})
	})

	it('Should return 410 for SlugIsDeletedError', async () => {
		app = express()
		app.get('/test', (_req, _res, next) => {
			next(new SlugIsDeletedError())
		})
		app.use(errorHandler)

		const response = await request(app).get('/test')
		expect(response.status).toBe(410)
		expect(response.body).toEqual({
			code: SLUG_ERROR.slugIsDeleted.code,
			message: SLUG_ERROR.slugIsDeleted.message,
		})
	})

	it('Should return 503 for SlugGenerationExhaustedError', async () => {
		app = express()
		app.get('/test', (_req, _res, next) => {
			next(new SlugGenerationExhaustedError())
		})
		app.use(errorHandler)

		const response = await request(app).get('/test')
		expect(response.status).toBe(503)
		expect(response.body).toEqual({
			code: SLUG_ERROR.slugGenerationExhausted.code,
			message: SLUG_ERROR.slugGenerationExhausted.message,
		})
	})

	it('Should return 409 for SlugAlreadyExistsError', async () => {
		app = express()
		app.get('/test', (_req, _res, next) => {
			next(new SlugAlreadyExistsError())
		})
		app.use(errorHandler)

		const response = await request(app).get('/test')
		expect(response.status).toBe(409)
		expect(response.body).toEqual({
			code: SLUG_ERROR.slugAlreadyExists.code,
			message: SLUG_ERROR.slugAlreadyExists.message,
		})
	})

	it('Should return 413 for PayloadTooLargeError', async () => {
		app = express()
		app.get('/test', (_req, _res, next) => {
			next(new PayloadTooLargeError())
		})
		app.use(errorHandler)

		const response = await request(app).get('/test')
		expect(response.status).toBe(413)
		expect(response.body).toEqual({
			code: SECURITY_ERROR.payloadTooLarge.code,
			message: SECURITY_ERROR.payloadTooLarge.message,
		})
	})

	it('Should return 422 for CaptchaVerificationError', async () => {
		app = express()
		app.get('/test', (_req, _res, next) => {
			next(new CaptchaVerificationError())
		})
		app.use(errorHandler)

		const response = await request(app).get('/test')
		expect(response.status).toBe(422)
		expect(response.body).toEqual({
			code: SECURITY_ERROR.invalidCaptchaToken.code,
			message: SECURITY_ERROR.invalidCaptchaToken.message,
		})
	})

	it('Should return 429 for TooManyRequestsError', async () => {
		app = express()
		app.get('/test', (_req, _res, next) => {
			next(new TooManyRequestsError())
		})
		app.use(errorHandler)

		const response = await request(app).get('/test')
		expect(response.status).toBe(429)
		expect(response.body).toEqual({
			code: SECURITY_ERROR.tooManyRequests.code,
			message: SECURITY_ERROR.tooManyRequests.message,
		})
	})

	it('Should return 400 for generic DomainError (like InvalidUrlError)', async () => {
		app = express()
		app.get('/test', (_req, _res, next) => {
			next(new InvalidUrlError())
		})
		app.use(errorHandler)

		const response = await request(app).get('/test')
		expect(response.status).toBe(400)
		expect(response.body).toEqual({
			code: VALIDATION_ERROR.invalidUrl.code,
			message: VALIDATION_ERROR.invalidUrl.message,
		})
	})

	it('Should return 500 for non-domain generic errors', async () => {
		app = express()
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

		app.get('/test', (_req, _res, next) => {
			next(new Error('Something blew up'))
		})
		app.use(errorHandler)

		const response = await request(app).get('/test')
		expect(response.status).toBe(500)
		expect(response.body).toEqual({
			code: INFRA_ERROR.internalServerError.code,
			message: INFRA_ERROR.internalServerError.message,
		})

		consoleSpy.mockRestore()
	})

	it('Should return 503 for CaptchaServiceError', async () => {
		app = express()
		app.get('/test', (_req, _res, next) => {
			next(new CaptchaServiceError())
		})
		app.use(errorHandler)

		const response = await request(app).get('/test')
		expect(response.status).toBe(503)
		expect(response.body).toEqual({
			code: INFRA_ERROR.captchaServiceError.code,
			message: INFRA_ERROR.captchaServiceError.message,
		})
	})
})

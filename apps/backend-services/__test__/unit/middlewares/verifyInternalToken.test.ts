import { describe, expect, it, vi } from 'vitest'
import { createVerifyInternalTokenMiddleware } from '@/adapters/primary/http/middlewares/verifyInternalToken.middleware.ts'
import { INTERNAL_TOKEN_ERROR_RESPONSES } from '@min-url/contracts/errors'
import type { Request, Response } from 'express'

const TEST_SECRET = 'unit_test_secret_12345678901234567890'
const verifyTokenMiddleware = createVerifyInternalTokenMiddleware(TEST_SECRET)

const makeMocks = (authorization?: string) => ({
	req: {
		headers: authorization ? { authorization } : {},
	} as Partial<Request>,
	res: {
		status: vi.fn().mockReturnThis(),
		json: vi.fn(),
	} as Partial<Response>,
	next: vi.fn(),
})

describe('verifyInternalToken Middleware (Self-Contained Unit Test)', () => {
	it('Should call next() if the token matches the injected secret', () => {
		const { req, res, next } = makeMocks(`Bearer ${TEST_SECRET}`)

		verifyTokenMiddleware(req as Request, res as Response, next)

		expect(next).toHaveBeenCalled()
		expect(res.status).not.toHaveBeenCalled()
	})

	it('Should return 401 if the Authorization header is missing', () => {
		const { req, res, next } = makeMocks()

		verifyTokenMiddleware(req as Request, res as Response, next)

		expect(next).not.toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith(
			INTERNAL_TOKEN_ERROR_RESPONSES.missingHeader,
		)
	})

	it('Should return 401 if the Authorization header is invalid or malformed', () => {
		const { req, res, next } = makeMocks('Bearer invalid-token')

		verifyTokenMiddleware(req as Request, res as Response, next)

		expect(next).not.toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith(
			INTERNAL_TOKEN_ERROR_RESPONSES.invalidHeader,
		)
	})

	it('Should return 401 if the Authorization header token is empty', () => {
		const { req, res, next } = makeMocks('Bearer ')

		verifyTokenMiddleware(req as Request, res as Response, next)

		expect(next).not.toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith(
			INTERNAL_TOKEN_ERROR_RESPONSES.missingHeader,
		)
	})

	it('Should return 401 if scheme is NOT Bearer even with valid secret', () => {
		const { req, res, next } = makeMocks(`Basic ${TEST_SECRET}`)

		verifyTokenMiddleware(req as Request, res as Response, next)

		expect(next).not.toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith(
			INTERNAL_TOKEN_ERROR_RESPONSES.invalidHeader,
		)
	})

	it('Should handle multiple spaces around Bearer scheme and valid secret correctly', () => {
		const { req, res, next } = makeMocks(
			`        Bearer            ${TEST_SECRET}   `,
		)

		verifyTokenMiddleware(req as Request, res as Response, next)

		expect(next).toHaveBeenCalled()
		expect(res.status).not.toHaveBeenCalled()
	})

	it('Should return 401 if extra tokens are present in Authorization header', () => {
		const { req, res, next } = makeMocks(`Bearer ${TEST_SECRET} extra_token`)

		verifyTokenMiddleware(req as Request, res as Response, next)

		expect(next).not.toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith(
			INTERNAL_TOKEN_ERROR_RESPONSES.invalidHeader,
		)
	})
})

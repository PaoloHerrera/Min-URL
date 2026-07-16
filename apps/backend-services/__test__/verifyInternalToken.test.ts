import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest'
import { verifyInternalToken } from '../src/adapters/primary/http/middlewares/verifyInternalToken.middleware.ts'
import type { Request, Response } from 'express'

const SECRET = 'super_secret_and_secure_token'

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

describe('verifyInternalToken Middleware', () => {
	beforeEach(() => {
		vi.stubEnv('INTERNAL_SECRET', SECRET)
	})

	afterEach(() => {
		vi.unstubAllEnvs()
	})

	it('Should call next() if the token is valid', () => {
		const { req, res, next } = makeMocks(`Bearer ${SECRET}`)

		verifyInternalToken(req as Request, res as Response, next)

		expect(next).toHaveBeenCalled()
		expect(res.status).not.toHaveBeenCalled()
	})

	it('Should return 401 if the Authorization header is missing', () => {
		const { req, res, next } = makeMocks()

		verifyInternalToken(req as Request, res as Response, next)

		expect(next).not.toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith({
			message: 'Authorization header missing',
		})
	})

	it('Should return 401 if the Authorization header is invalid or malformed', () => {
		const { req, res, next } = makeMocks('Bearer invalid-token')

		verifyInternalToken(req as Request, res as Response, next)

		expect(next).not.toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(401)
		expect(res.json).toHaveBeenCalledWith({
			message: 'Invalid or malformed Authorization header',
		})
	})
})

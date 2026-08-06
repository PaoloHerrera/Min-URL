import { describe, it, expect, vi } from 'vitest'
import { type NextFunction, type Request, type Response } from 'express'
import type { CaptchaServicePort } from '@/core/ports/outbound/CaptchaServicePort.interface.ts'
import {
	InvalidCaptchaTokenError,
	CaptchaServiceError,
} from '@/adapters/errors/infra.errors.ts'
import { createVerifyCaptchaMiddleware } from '@/adapters/primary/http/middlewares/verifyCaptcha.middleware.ts'

const makeMocks = (body: Record<string, unknown> = {}) => ({
	req: { body } as Partial<Request>,
	res: {} as Partial<Response>,
	next: vi.fn() as NextFunction,
})

const mockCaptchaService = (isValid: boolean) =>
	({
		verify: vi.fn().mockResolvedValue(isValid),
	}) as CaptchaServicePort

describe('Verify Captcha Middleware', () => {
	it('Should call next without errors when captcha is valid', async () => {
		const { req, res, next } = makeMocks({ captchaToken: 'valid-captcha' })
		const captchaService = mockCaptchaService(true)
		const verifyCaptchaMiddleware =
			createVerifyCaptchaMiddleware(captchaService)
		await verifyCaptchaMiddleware(
			req as Request,
			res as Response,
			next as NextFunction,
		)
		expect(captchaService.verify).toHaveBeenCalledWith('valid-captcha')
		expect(next).toHaveBeenCalledWith()
	})

	it('Should call next without errors when captcha is valid using turnstileToken', async () => {
		const { req, res, next } = makeMocks({
			turnstileToken: 'turnstile-valid-token',
		})
		const captchaService = mockCaptchaService(true)
		const verifyCaptchaMiddleware =
			createVerifyCaptchaMiddleware(captchaService)
		await verifyCaptchaMiddleware(
			req as Request,
			res as Response,
			next as NextFunction,
		)
		expect(captchaService.verify).toHaveBeenCalledWith('turnstile-valid-token')
		expect(next).toHaveBeenCalledWith()
	})

	it('Should call next with InvalidCaptchaTokenError when captcha is invalid', async () => {
		const { req, res, next } = makeMocks({ captchaToken: 'invalid-captcha' })
		const captchaService = mockCaptchaService(false)
		const verifyCaptchaMiddleware =
			createVerifyCaptchaMiddleware(captchaService)
		await verifyCaptchaMiddleware(
			req as Request,
			res as Response,
			next as NextFunction,
		)
		expect(next).toHaveBeenCalled()
		expect(next).toHaveBeenCalledWith(expect.any(InvalidCaptchaTokenError))
	})

	it('Should call next with InvalidCaptchaTokenError when captcha is missing', async () => {
		const { req, res, next } = makeMocks({ captchaToken: '' })
		const captchaService = mockCaptchaService(true)
		const verifyCaptchaMiddleware =
			createVerifyCaptchaMiddleware(captchaService)
		await verifyCaptchaMiddleware(
			req as Request,
			res as Response,
			next as NextFunction,
		)
		expect(next).toHaveBeenCalled()
		expect(next).toHaveBeenCalledWith(expect.any(InvalidCaptchaTokenError))
	})

	it('Should call next with InvalidCaptchaTokenError when captcha is null', async () => {
		const { req, res, next } = makeMocks({ captchaToken: null })
		const captchaService = mockCaptchaService(true)
		const verifyCaptchaMiddleware =
			createVerifyCaptchaMiddleware(captchaService)
		await verifyCaptchaMiddleware(
			req as Request,
			res as Response,
			next as NextFunction,
		)
		expect(next).toHaveBeenCalled()
		expect(next).toHaveBeenCalledWith(expect.any(InvalidCaptchaTokenError))
	})

	it('Should call next with InvalidCaptchaTokenError when captcha is undefined', async () => {
		const { req, res, next } = makeMocks({ captchaToken: undefined })
		const captchaService = mockCaptchaService(true)
		const verifyCaptchaMiddleware =
			createVerifyCaptchaMiddleware(captchaService)
		await verifyCaptchaMiddleware(
			req as Request,
			res as Response,
			next as NextFunction,
		)
		expect(next).toHaveBeenCalled()
		expect(next).toHaveBeenCalledWith(expect.any(InvalidCaptchaTokenError))
	})

	it('Should call next with CaptchaServiceError when captcha service throws an error', async () => {
		const { req, res, next } = makeMocks({ captchaToken: 'valid-captcha' })
		const captchaService = {
			verify: vi.fn().mockRejectedValue(new CaptchaServiceError()),
		} as CaptchaServicePort
		const verifyCaptchaMiddleware =
			createVerifyCaptchaMiddleware(captchaService)
		await verifyCaptchaMiddleware(
			req as Request,
			res as Response,
			next as NextFunction,
		)
		expect(next).toHaveBeenCalled()
		expect(next).toHaveBeenCalledWith(expect.any(CaptchaServiceError))
	})
})

import { describe, expect, it, vi } from 'vitest'
import { validateUrl } from '../src/adapters/primary/http/middlewares/validateUrl.middleware.ts'
import type { Request, Response } from 'express'

const makeMocks = (url: unknown) => ({
	req: { body: { originalUrl: url } } as Partial<Request>,
	res: {
		status: vi.fn().mockReturnThis(),
		json: vi.fn(),
	} as Partial<Response>,
	next: vi.fn(),
})

describe('validateUrl Middleware', () => {
	it('Should call next() for a valid URL', () => {
		const { req, res, next } = makeMocks('https://www.google.com')

		validateUrl(req as Request, res as Response, next)

		expect(next).toHaveBeenCalled()
		expect(res.status).not.toHaveBeenCalled()
	})

	it('Should call next() when protocol is missing — prepends https://', () => {
		const { req, res, next } = makeMocks('www.google.com')

		validateUrl(req as Request, res as Response, next)

		expect(next).toHaveBeenCalled()
		expect(res.status).not.toHaveBeenCalled()
	})

	it.each([
		['', 'empty string'],
		[123, 'number'],
		[undefined, 'undefined'],
		[true, 'boolean'],
		[null, 'null'],
		['invalid-url-without-protocol', 'invalid format'],
	])(
		'Should return 400 for invalid originalUrl — %s (%s)',
		(
			url: string | number | null | undefined | boolean,
			_description: string,
		) => {
			const { req, res, next } = makeMocks(url)

			validateUrl(req as Request, res as Response, next)

			expect(next).not.toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(400)
			expect(res.json).toHaveBeenCalledWith({ message: 'Invalid URL.' })
		},
	)
})

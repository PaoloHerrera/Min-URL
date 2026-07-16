import { describe, it, expect, vi } from 'vitest'
import { validateSlug } from '../src/adapters/primary/http/middlewares/validateSlug.middleware.ts'
import type { Request, Response } from 'express'

const makeMocks = (slug: string) => ({
	req: { params: { slug } } as Partial<Request>,
	res: {
		status: vi.fn().mockReturnThis(),
		json: vi.fn(),
	} as Partial<Response>,
	next: vi.fn(),
})

describe('validateSlug Middleware', () => {
	it('Should call next() if the slug format is valid', () => {
		const { req, res, next } = makeMocks('validslug')

		validateSlug(req as Request, res as Response, next)

		expect(next).toHaveBeenCalled()
		expect(res.status).not.toHaveBeenCalled()
	})

	it.each([
		['invalid-slug', 'special characters'],
		['inv', 'too short (< 6 chars)'],
		['invalidslugtoolong123', 'too long (> 12 chars)'],
		['', 'empty'],
		["slug' OR 1=1 -- ", 'SQL injection characters'],
	])('Should return 400 for invalid slug — %s (%s)', (slug) => {
		const { req, res, next } = makeMocks(slug)

		validateSlug(req as Request, res as Response, next)

		expect(next).not.toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({ message: 'Invalid slug format' })
	})
})

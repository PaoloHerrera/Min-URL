import { describe, expect, it, vi } from 'vitest'
import { checkForbiddenExtension } from '../middleware/checkForbiddenExtension.js'
import type { Request, Response } from 'express'

const makeMocks = (url: string) => ({
	req: { body: { originalUrl: url } } as Partial<Request>,
	res: {
		status: vi.fn().mockReturnThis(),
		json: vi.fn(),
	} as Partial<Response>,
	next: vi.fn(),
})

describe('checkForbiddenExtension Middleware', () => {
	it('Should call next() if the URL is valid', () => {
		const { req, res, next } = makeMocks('https://www.google.com')

		checkForbiddenExtension(req as Request, res as Response, next)

		expect(next).toHaveBeenCalledTimes(1)
		expect(res.status).not.toHaveBeenCalled()
		expect(res.json).not.toHaveBeenCalled()
	})

	it('Should block and return 400 if the URL has a forbidden extension (e.g., .exe)', () => {
		const { req, res, next } = makeMocks(
			'https://www.myurl.com/malicious-file.exe',
		)

		checkForbiddenExtension(req as Request, res as Response, next)

		expect(next).not.toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden extension.' })
	})

	it.each([
		'https://example.com/index.php?id=123',
		'https://example.com/assets/main.js',
		'https://example.com/documents/cv.pdf',
		'https://example.com/files/dataset.zip',
		'https://example.com/vector/logo.svg',
	])('Should call next() for allowed extension: %s', (url) => {
		const { req, res, next } = makeMocks(url)

		checkForbiddenExtension(req as Request, res as Response, next)

		expect(next).toHaveBeenCalledTimes(1)
		expect(res.status).not.toHaveBeenCalled()
		expect(res.json).not.toHaveBeenCalled()
	})
})

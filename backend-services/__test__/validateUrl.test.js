import { describe, expect, it, vi } from 'vitest'
import { validateUrl } from '../middleware/validateUrl.js'

describe('validateUrl middleware', () => {
	it('should validate a valid URL and call next()', () => {
		const req = { body: { originalUrl: 'https://www.google.com' } }
		const res = {}
		const next = vi.fn()
		validateUrl(req, res, next)
		expect(next).toHaveBeenCalled()
	})

	it('should validate a URL with added https when protocol is missing and call next()', () => {
		const req = { body: { originalUrl: 'www.google.com' } }
		const res = {}
		const next = vi.fn()
		validateUrl(req, res, next)
		expect(next).toHaveBeenCalled()
	})

	it('should return 400 if originalUrl is empty', () => {
		const req = { body: { originalUrl: '' } }
		const res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
		const next = vi.fn()
		validateUrl(req, res, next)
		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({ message: 'Invalid URL.' })
	})

	it('should return 400 if originalUrl is not a string', () => {
		const req = { body: { originalUrl: 123 } }
		const res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
		const next = vi.fn()
		validateUrl(req, res, next)
		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({ message: 'Invalid URL.' })
	})

	it('should return 400 if originalUrl is undefined', () => {
		const req = { body: { originalUrl: undefined } }
		const res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
		const next = vi.fn()
		validateUrl(req, res, next)
		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({ message: 'Invalid URL.' })
	})

	it('should return 400 if originalUrl is null', () => {
		const req = { body: { originalUrl: null } }
		const res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
		const next = vi.fn()
		validateUrl(req, res, next)
		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({ message: 'Invalid URL.' })
	})

	it('should return 400 if the originalUrl is invalid format', () => {
		const req = { body: { originalUrl: 'invalid-url-without-protocol' } }
		const res = { status: vi.fn().mockReturnThis(), json: vi.fn() }
		const next = vi.fn()
		validateUrl(req, res, next)
		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({ message: 'Invalid URL.' })
	})
})

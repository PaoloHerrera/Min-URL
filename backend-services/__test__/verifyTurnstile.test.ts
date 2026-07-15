import { describe, it, expect, vi, afterEach } from 'vitest'
import axios from 'axios'
import { verifyTurnstile } from '../middleware/verifyTurnstile.js'
import type { Request, Response } from 'express'

vi.mock('axios')

const makeMocks = (turnstileToken?: string) => ({
	req: {
		body: {
			originalUrl: 'https://www.google.com',
			...(turnstileToken !== undefined && { turnstileToken }),
		},
	} as Partial<Request>,
	res: {
		status: vi.fn().mockReturnThis(),
		json: vi.fn(),
	} as Partial<Response>,
	next: vi.fn(),
})

describe('verifyTurnstile Middleware', () => {
	afterEach(() => {
		vi.clearAllMocks()
	})

	it('Should return 400 if turnstileToken is missing in the body', async () => {
		const { req, res, next } = makeMocks()

		await verifyTurnstile(req as Request, res as Response, next)

		expect(next).not.toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({
			message: 'Turnstile token is missing.',
		})
	})

	it('Should return 403 if the turnstile token is incorrect', async () => {
		vi.mocked(axios.post).mockResolvedValue({ data: { success: false } })

		const { req, res, next } = makeMocks('invalid-token')

		await verifyTurnstile(req as Request, res as Response, next)

		expect(next).not.toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(403)
		expect(res.json).toHaveBeenCalledWith({
			message: 'Turnstile token is incorrect.',
		})
	})

	it('Should call next() if the turnstile token is correct', async () => {
		vi.mocked(axios.post).mockResolvedValue({ data: { success: true } })

		const { req, res, next } = makeMocks('valid-token')

		await verifyTurnstile(req as Request, res as Response, next)

		expect(next).toHaveBeenCalledTimes(1)
		expect(res.status).not.toHaveBeenCalled()
		expect(res.json).not.toHaveBeenCalled()
	})
})

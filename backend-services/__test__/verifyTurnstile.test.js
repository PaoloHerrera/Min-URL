import { describe, it, expect, vi, afterEach } from 'vitest'
import axios from 'axios'
import { verifyTurnstile } from '../middleware/verifyTurnstile.js'

vi.mock('axios')

describe('verifyTurnstile Middleware', () => {
	afterEach(() => {
		vi.clearAllMocks()
	})
	it('should return 400 if turnstileToken is missing in the body', async () => {
		//1. Create Mock request without turstileToken
		const req = {
			body: {
				originalUrl: 'https://www.google.com',
			},
		}

		//2. Create Mock response with status and json methods
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		}

		//3. Create Mock next() function
		const next = vi.fn()

		//4. Call the middleware function
		await verifyTurnstile(req, res, next)

		//5. Assert
		expect(next).not.toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({
			message: 'Turnstile token is missing.',
		})
	})

	it('should return 403 if token is incorrect', async () => {
		//1. Create Mock request with turstileToken
		const req = {
			body: {
				originalUrl: 'https://www.google.com',
				turnstileToken: 'invalid-token',
			},
		}

		//2. Mock response object
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		}

		//3. Create Mock next() function
		const next = vi.fn()

		//4. Mock axios.post to return an object with success: false
		vi.mocked(axios.post).mockResolvedValue({
			data: {
				success: false,
			},
		})

		//5. Call the middleware function
		await verifyTurnstile(req, res, next)

		//6. Assert
		expect(next).not.toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(403)
		expect(res.json).toHaveBeenCalledWith({
			message: 'Turnstile token is incorrect.',
		})
	})

	it('should call next() if token is correct', async () => {
		//1. Create Mock request with correct turstileToken
		const req = {
			body: {
				originalUrl: 'https://www.google.com',
				turnstileToken: 'valid-token',
			},
		}

		//2. Create Mock response object
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		}

		//3. Create Mock next() function
		const next = vi.fn()

		//4. Mock axios.post to return an object with success: true
		vi.mocked(axios.post).mockResolvedValue({
			data: {
				success: true,
			},
		})

		//5. Call the middleware function
		await verifyTurnstile(req, res, next)

		//6. Assert
		expect(next).toHaveBeenCalledTimes(1)
		expect(res.status).not.toHaveBeenCalled()
		expect(res.json).not.toHaveBeenCalled()
	})
})

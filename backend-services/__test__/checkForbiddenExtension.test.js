import { describe, expect, test, vi } from 'vitest'
import { checkForbiddenExtension } from '../middleware/checkForbiddenExtension.js'

describe('checkForbiddenExtension Middleware', () => {
	test('should call next() if the URL is valid', () => {
		//Mock request (req)
		const req = {
			body: {
				originalUrl: 'https://www.google.com',
			},
		}

		//Mock response (res)
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		}

		//Mock next() function
		const next = vi.fn()

		//Call the middleware
		checkForbiddenExtension(req, res, next)

		//Assert
		expect(next).toHaveBeenCalledTimes(1)
		expect(res.status).not.toHaveBeenCalled()
		expect(res.json).not.toHaveBeenCalled()
	})

	test('should block and return 400 if the URL has a forbidden extension (e.g., .exe', () => {
		//Mock request (req)
		const req = {
			body: {
				originalUrl: 'https://www.myurl.com/malicious-file.exe',
			},
		}

		//Mock response (res)
		const res = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		}

		//Mock next() function
		const next = vi.fn()

		//Call the middleware
		checkForbiddenExtension(req, res, next)

		//Assert
		// Should block and return 400
		expect(next).not.toHaveBeenCalled()
		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({
			message: 'Forbidden extension.',
		})
	})

	test('should call next() for URLs with allowed web/document extensions (e.g., .php, .js, .pdf, .zip)', () => {
		const safeUrls = [
			'https://example.com/index.php?id=123',
			'https://example.com/assets/main.js',
			'https://example.com/documents/cv.pdf',
			'https://example.com/files/dataset.zip',
			'https://example.com/vector/logo.svg',
		]

		for (const url of safeUrls) {
			const req = {
				body: { originalUrl: url },
			}
			const res = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			}
			const next = vi.fn()

			checkForbiddenExtension(req, res, next)

			expect(next).toHaveBeenCalledTimes(1)
			expect(res.status).not.toHaveBeenCalled()
			expect(res.json).not.toHaveBeenCalled()
		}
	})
})

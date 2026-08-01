import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'
import { app } from '@/app.ts'
import { DrizzleShortUrlRepository } from '@/adapters/secondary/db/DrizzleShortUrlRepository.ts'

vi.mock('@/adapters/secondary/captcha/TurnstileCaptchaService.ts', () => ({
	TurnstileCaptchaService: class {
		verify = vi.fn().mockResolvedValue(true)
	},
}))

describe('POST /direct/shorten', () => {
	const repository = new DrizzleShortUrlRepository()
	it('Should create shortened url using the real client IP and ignore req.body.ip', async () => {
		const response = await request(app)
			.post('/direct/shorten')
			.send({
				originalUrl: 'https://www.google.com',
				captchaToken: 'fake-token',
				ip: '8.8.8.8',
			})
			.set('X-Forwarded-For', '203.0.113.42')

		expect(response.status).toBe(200)

		// Verify that the client IP was correctly captured in the database
		const createdUrl = await repository.getUrlBySlug(response.body.slug)
		expect(createdUrl?.ipAddress.ipAddress).toBe('203.0.113.42')
	})
})

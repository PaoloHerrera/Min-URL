import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'
import { app } from '@/app.ts'

vi.mock('@/adapters/secondary/captcha/TurnstileCaptchaService.ts', () => ({
	TurnstileCaptchaService: class {
		verify = vi.fn().mockResolvedValue(true)
	},
}))

describe('POST /direct/shorten', () => {
	it('Should not return x-powered-by header', async () => {
		const response = await request(app).post('/direct/shorten').send({
			originalUrl: 'https://www.google.com',
			captchaToken: 'fake-token',
		})

		expect(response.status).toBe(200)

		expect(response.headers).not.toHaveProperty('x-powered-by')
	})

	it('Should return x-content-type-options header with value nosniff', async () => {
		const response = await request(app).post('/direct/shorten').send({
			originalUrl: 'https://www.google.com',
			captchaToken: 'fake-token',
		})

		expect(response.status).toBe(200)

		expect(response.headers).toHaveProperty('x-content-type-options', 'nosniff')
	})

	it('Should return DENY value for x-frame-options header', async () => {
		const response = await request(app).post('/direct/shorten').send({
			originalUrl: 'https://www.google.com',
			captchaToken: 'fake-token',
		})

		expect(response.status).toBe(200)

		expect(response.headers).toHaveProperty('x-frame-options', 'DENY')
	})

	it('Should return off value for x-dns-prefetch-control header', async () => {
		const response = await request(app).post('/direct/shorten').send({
			originalUrl: 'https://www.google.com',
			captchaToken: 'fake-token',
		})

		expect(response.status).toBe(200)

		expect(response.headers).toHaveProperty('x-dns-prefetch-control', 'off')
	})
})

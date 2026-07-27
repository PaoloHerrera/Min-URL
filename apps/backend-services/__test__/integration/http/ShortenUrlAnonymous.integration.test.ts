import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'
import { app } from '@/app.ts'

vi.mock('@/adapters/secondary/captcha/TurnstileCaptchaService.ts', () => ({
	TurnstileCaptchaService: class {
		verify = vi.fn().mockResolvedValue(true)
	},
}))

describe('POST /direct/shorten', () => {
	it('Should successfully create a shortened URL anonymously', async () => {
		const response = await request(app).post('/direct/shorten').send({
			originalUrl: 'https://www.google.com',
			captchaToken: 'fake-token',
		})

		expect(response.status).toBe(200)
		expect(response.headers['content-type']).toBe(
			'application/json; charset=utf-8',
		)
		expect(response.body).toBeInstanceOf(Object)

		expect(response.body).toHaveProperty('originalUrl')
		expect(response.body.originalUrl).toBe('https://www.google.com')

		expect(response.body).toHaveProperty('shortUrl')
		expect(typeof response.body.shortUrl).toBe('string')

		expect(response.body).toHaveProperty('slug')
		expect(typeof response.body.slug).toBe('string')

		expect(response.body).toHaveProperty('createdAt')
		expect(new Date(response.body.createdAt)).toBeInstanceOf(Date)

		expect(response.body.shortUrl).toContain(response.body.slug)
	})

	it('Should return 400 for an invalid URL', async () => {
		const response = await request(app).post('/direct/shorten').send({
			originalUrl: 'invalid-url-without-protocol',
			captchaToken: 'fake-token',
		})

		expect(response.status).toBe(400)
		expect(response.body).toHaveProperty('message')
		expect(typeof response.body.message).toBe('string')
	})

	it('Should return 400 when originalUrl exceeds 2048 characters', async () => {
		// 'https://example.com/' = 20 chars + 2030 'a' = 2050 chars total
		const longUrl = 'https://example.com/' + 'a'.repeat(2030)
		const response = await request(app).post('/direct/shorten').send({
			originalUrl: longUrl,
			captchaToken: 'fake-token',
		})

		expect(response.status).toBe(400)
		expect(response.body).toHaveProperty('message')
	})
})

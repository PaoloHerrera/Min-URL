import request from 'supertest'
import { describe, it, expect } from 'vitest'
import { app } from '@/app.ts'
import { SECURITY_ERROR } from '@min-url/contracts/errors'

describe('POST /direct/shorten payload limit & JSON syntax integration tests', () => {
	it('Should return 413 error if the JSON Body exceeds 5KB', async () => {
		const largeUrl = `https://example.com/${'a'.repeat(5500)}`
		const largePayload = {
			originalUrl: largeUrl,
			captchaToken: 'fake-token',
		}

		const response = await request(app)
			.post('/direct/shorten')
			.send(largePayload)

		expect(response.status).toBe(413)
		expect(response.body).toEqual({
			code: SECURITY_ERROR.payloadTooLarge.code,
			message: SECURITY_ERROR.payloadTooLarge.message,
		})
	})

	it('Should return 400 Bad Request if the JSON Body is malformed', async () => {
		const response = await request(app)
			.post('/direct/shorten')
			.set('Content-Type', 'application/json')
			.send('{ "originalUrl": ')

		expect(response.status).toBe(400)
		expect(response.body).toEqual({
			code: SECURITY_ERROR.invalidJson.code,
			message: SECURITY_ERROR.invalidJson.message,
		})
	})

	it('Should NOT return 413 if the JSON Body is within 5KB limit', async () => {
		const validPayload = {
			originalUrl: `https://example.com/${'a'.repeat(2000)}`,
			captchaToken: 'fake-token',
		}

		const response = await request(app)
			.post('/direct/shorten')
			.send(validPayload)

		expect(response.status).not.toBe(413)
	})
})

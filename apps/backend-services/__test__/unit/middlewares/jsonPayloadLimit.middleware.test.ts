import request from 'supertest'
import { describe, expect, it } from 'vitest'
import express from 'express'
import { jsonPayloadLimit } from '@/adapters/primary/http/middlewares/jsonPayloadLimit.middleware.ts'
import { errorHandler } from '@/adapters/primary/http/middlewares/errorHandler.middleware.ts'
import { HTTP_ERROR_CODES } from '@min-url/contracts/errors'

const createTestApp = (limit: number) => {
	const testApp = express()
	testApp.set('trust proxy', 1)
	testApp.use(jsonPayloadLimit(limit))
	testApp.use('/test', (_req, res) => {
		res.status(200).json({ ok: true })
	})
	testApp.use(errorHandler)
	return testApp
}

describe('jsonPayloadLimit (Unit Test)', () => {
	it('Should return 413 for payload larger than limit', async () => {
		const app = createTestApp(5)
		const response = await request(app)
			.post('/test')
			.send({
				longUrl: 'https://example.com?q=' + 'a'.repeat(10000),
			})
		expect(response.status).toBe(413)
		expect(response.body).toEqual({
			code: HTTP_ERROR_CODES.payloadTooLarge.code,
			message: HTTP_ERROR_CODES.payloadTooLarge.message,
		})
	})

	it('Should return 200 when payload is within limit', async () => {
		const app = createTestApp(10)
		const response = await request(app)
			.post('/test')
			.send({ longUrl: 'https://example.com' })
		expect(response.status).toBe(200)
	})

	it('Should return 400 for invalid json', async () => {
		const app = createTestApp(5)
		const response = await request(app)
			.post('/test')
			.set('Content-Type', 'application/json')
			.send('invalid json')
		expect(response.status).toBe(400)
		expect(response.body).toEqual({
			code: HTTP_ERROR_CODES.invalidJson.code,
			message: HTTP_ERROR_CODES.invalidJson.message,
		})
	})
})

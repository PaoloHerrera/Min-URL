import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest'
import express from 'express'
import request from 'supertest'
import { corsMiddleware } from '@/adapters/primary/http/middlewares/cors.middleware.ts'

describe('corsMiddleware (Unit Test)', () => {
	let app: express.Express

	beforeEach(() => {
		app = express()
		app.use(corsMiddleware())
		app.get('/test', (req, res) => {
			res.status(200).send('ok')
		})
	})

	afterEach(() => {
		vi.unstubAllEnvs()
	})

	it('Should allow request and append header if origin is in the allowed list', async () => {
		vi.stubEnv(
			'CORS_ALLOWED_ORIGINS',
			'https://min-url.com,https://another.com',
		)
		const response = await request(app)
			.get('/test')
			.set('Origin', 'https://min-url.com')

		expect(response.status).toBe(200)
		expect(response.headers['access-control-allow-origin']).toBe(
			'https://min-url.com',
		)
	})

	it('Should default to localhost:4321 if CORS_ALLOWED_ORIGINS is not set', async () => {
		const response = await request(app)
			.get('/test')
			.set('Origin', 'http://localhost:4321')

		expect(response.status).toBe(200)
		expect(response.headers['access-control-allow-origin']).toBe(
			'http://localhost:4321',
		)
	})

	it('Should deny request (throw error) if origin is not allowed', async () => {
		vi.stubEnv('CORS_ALLOWED_ORIGINS', 'https://min-url.com')
		const response = await request(app)
			.get('/test')
			.set('Origin', 'https://denied.com')

		expect(response.status).toBe(500)
		expect(response.headers['access-control-allow-origin']).toBeUndefined()
	})
})

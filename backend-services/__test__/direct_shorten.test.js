import request from 'supertest'
import { describe, expect, test } from 'vitest'
import { app } from '../app.js'

const SITE_KEY = process.env.TURNSTILE_SITEKEY

describe('POST /direct/shorten', () => {
	test('should successfully create a shortened URL anonymously', async () => {
		const json = {
			originalUrl: 'https://www.google.com',
			turnstileToken: SITE_KEY,
		}

		const response = await request(app).post('/direct/shorten').send(json)

		//1. Check format and correct response status code.
		expect(response.status).toBe(200)
		expect(response.headers['content-type']).toBe(
			'application/json; charset=utf-8',
		)
		expect(response.body).toBeInstanceOf(Object)

		//2. Check payload properties and their types.
		//The response body must contain a originalUrl property and its value must be https://www.google.com.
		expect(response.body).toHaveProperty('originalUrl')
		expect(response.body.originalUrl).toBe('https://www.google.com')

		//The response body must contain a shortUrl property and its value must be a string.
		expect(response.body).toHaveProperty('shortUrl')
		expect(typeof response.body.shortUrl).toBe('string')

		//The response body must contain a slug property and its value must be a string.
		expect(response.body).toHaveProperty('slug')
		expect(typeof response.body.slug).toBe('string')

		//The response body must contain a purpose property and its value must be 'direct'.
		expect(response.body).toHaveProperty('purpose')
		expect(response.body.purpose).toBe('direct')

		//The response body must contain a createdAt property and its value must be a Date.
		expect(response.body).toHaveProperty('createdAt')
		expect(new Date(response.body.createdAt)).toBeInstanceOf(Date)

		//Verify if the shorurl contains the domain REDIRECTOR_URL and the slug.
		expect(response.body.shortUrl).toContain(response.body.slug)
	})

	test('should fail to create a shortened URL anonymously with an invalid URL', async () => {
		const response = await request(app).post('/direct/shorten').send({
			originalUrl: 'invalid-url-without-protocol',
		})
		expect(response.status).toBe(400)
		//validate error message and type
		expect(response.body).toHaveProperty('message')
		expect(typeof response.body.message).toBe('string')
	})
})

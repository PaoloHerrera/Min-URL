import { describe, expect, it } from 'vitest'
import { app } from '../src/app.ts'

describe('GET /:slug', () => {
	it('should redirect correctly to original URL if slug exists and is not protected by a password.', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/test-public',
		})
		expect(response.statusCode).toBe(302)
		expect(response.headers.location).toBe('https://www.google.com')
	})

	it('should redirect to error page if slug does not exist.', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/nonexistent-slug',
		})
		expect(response.statusCode).toBe(302)
		expect(response.headers.location).toBe(
			`http://localhost:4321/?message=Error:${encodeURIComponent('El slug no existe.')}`,
		)
	})

	it('should redirect to password protection page if slug is protected by a password.', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/test-protected',
		})
		expect(response.statusCode).toBe(302)
		expect(response.headers.location).toBe(
			`http://localhost:4321/password-protected?slug=${encodeURIComponent('test-protected')}`,
		)
	})
})

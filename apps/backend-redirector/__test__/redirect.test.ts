import { afterEach, describe, expect, it, vi } from 'vitest'
import { app } from '../src/app.ts'
import { env } from '../src/config/env.ts'

const FRONTEND_URL = env.FRONTEND_URL
const INTERNAL_SECRET = env.INTERNAL_SECRET

afterEach(() => {
	vi.restoreAllMocks()
	vi.unstubAllEnvs()
})

const mockFetch = (status: number, body: unknown) => {
	return vi.spyOn(globalThis, 'fetch').mockResolvedValue({
		ok: status >= 200 && status < 300,
		status,
		json: async () => body,
	} as Response)
}

const requestUrl = (url: string) =>
	app.inject({
		method: 'GET',
		url,
	})

const assertInternalApiCall = (spy: unknown, slug: string) => {
	expect(spy).toHaveBeenCalledWith(
		expect.stringContaining(`/internal/slug-data/${slug}`),
		expect.objectContaining({
			headers: expect.objectContaining({
				Authorization: `Bearer ${INTERNAL_SECRET}`,
			}),
		}),
	)
}

describe('GET /:slug', () => {
	describe('Fetch to the backend API', () => {
		it('Should redirect to the original URL if the slug is public', async () => {
			const fetchSpy = mockFetch(200, {
				password: false,
				originalUrl: 'https://www.google.com',
				slug: 'validslug',
			})

			const response = await requestUrl('/validslug')

			expect(response.statusCode).toBe(302)
			expect(response.headers.location).toBe('https://www.google.com')

			// Check if fetch was called with the correct arguments and headers
			assertInternalApiCall(fetchSpy, 'validslug')
		})

		it('Should redirect to the password protection page if the slug is password protected', async () => {
			const fetchSpy = mockFetch(200, { password: true, slug: 'protected' })

			const response = await requestUrl('/protected')

			expect(response.statusCode).toBe(302)
			expect(response.headers.location).toBe(
				`${FRONTEND_URL}/password-protected?slug=${encodeURIComponent('protected')}`,
			)

			// Check if fetch was called with the correct arguments and headers
			assertInternalApiCall(fetchSpy, 'protected')
		})

		it('Should redirect to the link-not-found page if the slug does not exist (404)', async () => {
			const fetchSpy = mockFetch(404, null)

			const response = await requestUrl('/invalid')

			expect(response.statusCode).toBe(302)
			expect(response.headers.location).toBe(`${FRONTEND_URL}/link-not-found`)

			// Check if fetch was called with the correct arguments and headers
			assertInternalApiCall(fetchSpy, 'invalid')
		})

		it('Should redirect to the error page if the API returns an unexpected error', async () => {
			const fetchSpy = mockFetch(500, null)

			const response = await requestUrl('/unexpected')

			expect(response.statusCode).toBe(302)
			expect(response.headers.location).toBe(`${FRONTEND_URL}/error`)

			// Check if fetch was called with the correct arguments and headers
			assertInternalApiCall(fetchSpy, 'unexpected')
		})

		it('Should redirect to the error page if the fetch throws (network error)', async () => {
			const fetchSpy = vi
				.spyOn(globalThis, 'fetch')
				.mockRejectedValue(new Error('Network error'))

			const response = await requestUrl('/network')

			expect(response.statusCode).toBe(302)
			expect(response.headers.location).toBe(`${FRONTEND_URL}/error`)

			// Check if fetch was called with the correct arguments and headers
			assertInternalApiCall(fetchSpy, 'network')
		})
	})

	describe('Slug format validations', () => {
		it.each([
			{ reason: 'contains invalid characters', slug: '/@@@213!!$' },
			{ reason: 'has less than 6 characters', slug: '/inv' },
			{ reason: 'has more than 12 characters', slug: '/invalidslugtolong' },
		])(
			'Should redirect to link-not-found if slug $reason',
			async ({ slug }) => {
				const fetchSpy = mockFetch(404, null)
				const response = await requestUrl(slug)

				expect(response.statusCode).toBe(302)
				expect(response.headers.location).toBe(`${FRONTEND_URL}/link-not-found`)
				expect(fetchSpy).not.toHaveBeenCalled()
			},
		)
	})

	describe('Environment variable validation', () => {
		it('Should validate required environment variables at startup', () => {
			expect(FRONTEND_URL).toBeDefined()
			expect(INTERNAL_SECRET.length).toBeGreaterThanOrEqual(32)
		})
	})
})

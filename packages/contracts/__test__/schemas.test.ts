import { describe, expect, it } from 'vitest'
import {
	httpUrlSchema,
	shortenAnonymousRequestSchema,
	shortenAnonymousResponseSchema,
	slugDataResponseSchema,
} from '../src/schemas.ts'

describe('httpUrlSchema (Contracts Unit Test)', () => {
	it('should accept valid http and https URLs', () => {
		expect(httpUrlSchema.safeParse('http://example.com').success).toBe(true)
		expect(
			httpUrlSchema.safeParse('https://example.com/path?arg=1').success,
		).toBe(true)
	})

	it('should reject non-http/https protocols like javascript:, data:, ftp:, file:', () => {
		expect(httpUrlSchema.safeParse('javascript:alert(1)').success).toBe(false)
		expect(httpUrlSchema.safeParse('data:text/html,<h1>hi</h1>').success).toBe(
			false,
		)
		expect(httpUrlSchema.safeParse('ftp://files.example.com').success).toBe(
			false,
		)
		expect(httpUrlSchema.safeParse('file:///etc/passwd').success).toBe(false)
	})

	it('should reject URLs exceeding 2048 characters limit', () => {
		const longUrl = `https://example.com/${'a'.repeat(2100)}`
		expect(httpUrlSchema.safeParse(longUrl).success).toBe(false)
	})

	it('should enforce httpUrlSchema in shortenAnonymousRequestSchema', () => {
		const result = shortenAnonymousRequestSchema.safeParse({
			originalUrl: 'javascript:alert("xss")',
		})
		expect(result.success).toBe(false)
	})

	it('should enforce httpUrlSchema in slugDataResponseSchema', () => {
		const result = slugDataResponseSchema.safeParse({
			slug: 'abc123',
			password: false,
			originalUrl: 'javascript:void(0)',
			queryAt: new Date().toISOString(),
		})
		expect(result.success).toBe(false)
	})

	it('should enforce httpUrlSchema in shortenAnonymousResponseSchema', () => {
		const result = shortenAnonymousResponseSchema.safeParse({
			originalUrl: 'javascript:alert("xss")',
			shortUrl: 'http://murl.cl/abc123',
			slug: 'abc123',
			createdAt: new Date().toISOString(),
		})
		expect(result.success).toBe(false)
	})
})

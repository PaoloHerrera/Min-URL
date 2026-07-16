import { describe, expect, it } from 'vitest'
import { validateUrl } from '@/lib/utils'

describe('validateUrl', () => {
	it('should return false if URL is not a string', () => {
		//@ts-expect-error - testing invalid types
		expect(validateUrl(undefined)).toBe(false)
		//@ts-expect-error - testing invalid types
		expect(validateUrl(null)).toBe(false)
		//@ts-expect-error - testing invalid types
		expect(validateUrl(123)).toBe(false)
	})

	it('should return false if URL is an empty string', () => {
		expect(validateUrl('')).toBe(false)
	})

	it('should return false if URL is invalid', () => {
		expect(validateUrl('invalid-url')).toBe(false)
	})

	it('should return false if URL use javascript protocol (XSS vector)', () => {
		expect(validateUrl('javascript://example.com')).toBe(false)
	})

	it('should return true if URL has no protocol (backend will normalize)', () => {
		expect(validateUrl('example.com')).toBe(true)
	})

	it('should return true if URL is valid', () => {
		expect(validateUrl('http://www.example.com/')).toBe(true)
		expect(validateUrl('https://example.com')).toBe(true)
	})
})

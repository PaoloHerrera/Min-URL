import { describe, expect, it } from 'vitest'
import { Referer } from '@/core/domain/value-objects/referer/Referer.vo.ts'

describe('Referer Value Object (Unit Test)', () => {
	it('Should successfully create Referer and extract domain for valid HTTP referer URL', () => {
		const referer = Referer.create('https://t.co/xyz123')
		expect(referer.value).toBe('https://t.co/xyz123')
		expect(referer.domain).toBe('t.co')
	})

	it('Should extract domain without www prefix for google/github referer URLs', () => {
		const referer = Referer.create('https://www.google.com/search?q=min-url')
		expect(referer.value).toBe('https://www.google.com/search?q=min-url')
		expect(referer.domain).toBe('google.com')
	})

	it('Should fall back to direct for null, undefined, empty, or whitespace-only referer', () => {
		expect(Referer.create(null).value).toBe('direct')
		expect(Referer.create(null).domain).toBe('direct')
		expect(Referer.create(undefined).value).toBe('direct')
		expect(Referer.create('').value).toBe('direct')
		expect(Referer.create('   ').value).toBe('direct')
	})

	it('Should handle invalid/unparseable referer strings gracefully with unknown domain', () => {
		const referer = Referer.create('invalid-referer-format')
		expect(referer.value).toBe('invalid-referer-format')
		expect(referer.domain).toBe('unknown')
	})

	it('Should truncate Referer strings exceeding standard web URL length limit (2048 chars)', () => {
		const excessivelyLongUrl = `https://example.com/${'a'.repeat(2100)}`
		const referer = Referer.create(excessivelyLongUrl)
		expect(referer.value.length).toBe(2048)
		expect(referer.domain).toBe('example.com')
	})

	it('Should reconstitute Referer from DB props without alteration', () => {
		const referer = Referer.reconstitute({
			value: 'https://twitter.com/post/1',
			domain: 'twitter.com',
		})
		expect(referer.value).toBe('https://twitter.com/post/1')
		expect(referer.domain).toBe('twitter.com')
	})
})

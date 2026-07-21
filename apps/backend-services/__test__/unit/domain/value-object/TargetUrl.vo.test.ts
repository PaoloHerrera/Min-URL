import { describe, expect, it } from 'vitest'
import { TargetUrl } from '@/core/domain/value-objects/target-url/TargetUrl.vo.ts'
import { InvalidUrlError } from '@/core/domain/errors/domain.errors.ts'

describe('TargetUrl Value Object', () => {
	it('Should successfully create TargetUrl for a valid URL', () => {
		const target = TargetUrl.create('https://www.google.com')
		expect(target.value).toBe('https://www.google.com')
	})

	it.each(['www.google.com', 'google.com'])(
		'Should successfully prepend http:// for URLs without protocol: %s',
		(url) => {
			const target = TargetUrl.create(url)
			expect(target.value).toBe('http://' + url)
		},
	)

	it.each([
		['', 'empty string'],
		['invalid-url-without-protocol', 'invalid format'],
		['ftp://invalid-url.com', 'ftp protocol'],
		['javascript:alert("XSS")', 'javascript protocol'],
	])(
		'Should throw error for invalid originalUrl — %s (%s)',
		(url, _description) => {
			expect(() => TargetUrl.create(url)).toThrow(InvalidUrlError)
		},
	)

	it.each([
		[123, 'number'],
		[undefined, 'undefined'],
		[true, 'boolean'],
		[null, 'null'],
	])(
		'Should throw error for non-string input — %s (%s)',
		(url, _description) => {
			expect(() => TargetUrl.create(url as any)).toThrow(InvalidUrlError)
		},
	)
})

import { describe, it, expect } from 'vitest'
import { Slug } from '@/core/domain/value-objects/slug/Slug.vo.ts'
import { InvalidSlugError } from '@/core/domain/errors/domain.errors.ts'

describe('Slug Value Object (Unit Test)', () => {
	it.each([
		['invalidslug*&^%@!?', 'special characters'],
		['__invalid_slug__', 'special characters and spaces'],
		['invalid slug', 'spaces'],
		['invalid-slug', 'hyphen'],
		['inv', 'too short (< 6 chars)'],
		['invalidslugtoolong123', 'too long (> 12 chars)'],
		['', 'empty'],
		["slug' OR 1=1 -- ", 'SQL injection characters'],
	])('Should return 400 for invalid slug — %s (%s)', (slug) => {
		expect(() => Slug.create(slug)).toThrow(InvalidSlugError)
	})

	it.each([
		['validslug', 'Only lowercase letters'],
		['validslug123', 'Lowercase letters and numbers'],
		['VALIDSLUG', 'Only uppercase letters'],
		['ValidSlug123', 'Uppercase letters, and numbers'],
	])('Should successfully create Slug for a valid slug — %s (%s)', (slug) => {
		expect(Slug.create(slug).value).toBe(slug)
	})
})

import { describe, expect, it } from 'vitest'
import { extractClientIp } from '@/adapters/primary/http/utils/extractClientIp.ts'

describe('extractClientIp', () => {
	describe('X-Forwarded-For header as string', () => {
		it('should return the first IP from a single-value header', () => {
			expect(extractClientIp('203.0.113.1')).toBe('203.0.113.1')
		})

		it('should return the first IP from a comma-separated list', () => {
			expect(extractClientIp('203.0.113.1, 10.0.0.1, 172.16.0.1')).toBe(
				'203.0.113.1',
			)
		})

		it('should trim surrounding whitespace from the extracted IP', () => {
			expect(extractClientIp('  203.0.113.1  ')).toBe('203.0.113.1')
		})

		it('should return unknown if header is whitespace-only', () => {
			expect(extractClientIp('   ')).toBe('unknown')
		})

		it('should return unknown if first segment is whitespace-only', () => {
			expect(extractClientIp('   , 203.0.113.1')).toBe('unknown')
		})

		it('should return unknown if header is empty string', () => {
			expect(extractClientIp('')).toBe('unknown')
		})
	})

	describe('X-Forwarded-For header as array', () => {
		it('should return the first element from an array header', () => {
			expect(extractClientIp(['203.0.113.1', '10.0.0.1'])).toBe('203.0.113.1')
		})

		it('should trim whitespace from the first array element', () => {
			expect(extractClientIp(['  203.0.113.1  '])).toBe('203.0.113.1')
		})

		it('should return unknown if the first array element is whitespace-only', () => {
			expect(extractClientIp(['   '])).toBe('unknown')
		})

		it('should return unknown for an empty array', () => {
			expect(extractClientIp([])).toBe('unknown')
		})
	})

	describe('fallback to remoteAddress', () => {
		it('should return remoteAddress when forwardedFor is undefined', () => {
			expect(extractClientIp(undefined, '203.0.113.1')).toBe('203.0.113.1')
		})

		it('should trim whitespace from remoteAddress', () => {
			expect(extractClientIp(undefined, '  203.0.113.1  ')).toBe('203.0.113.1')
		})

		it('should return unknown if remoteAddress is whitespace-only', () => {
			expect(extractClientIp(undefined, '   ')).toBe('unknown')
		})

		it('should return unknown if both forwardedFor and remoteAddress are undefined', () => {
			expect(extractClientIp(undefined, undefined)).toBe('unknown')
		})

		it('should prefer forwardedFor over remoteAddress', () => {
			expect(extractClientIp('203.0.113.1', '10.0.0.1')).toBe('203.0.113.1')
		})
	})
})

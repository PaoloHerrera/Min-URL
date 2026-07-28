import { describe, expect, it } from 'vitest'
import { UserAgent } from '@/core/domain/value-objects/user-agent/UserAgent.vo.ts'

describe('UserAgent Value Object (Unit Test)', () => {
	const validUserAgentStr =
		'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

	it('Should successfully create a UserAgent for a valid User-Agent string', () => {
		const ua = UserAgent.create(validUserAgentStr)
		expect(ua.value).toBe(validUserAgentStr)
	})

	it('Should fall back to unknown for null, undefined, empty, or whitespace-only string', () => {
		expect(UserAgent.create(null).value).toBe('unknown')
		expect(UserAgent.create(undefined).value).toBe('unknown')
		expect(UserAgent.create('').value).toBe('unknown')
		expect(UserAgent.create('   ').value).toBe('unknown')
	})

	it('Should truncate User-Agent strings exceeding maximum length (512 chars)', () => {
		const excessivelyLongUa = 'A'.repeat(600)
		const ua = UserAgent.create(excessivelyLongUa)
		expect(ua.value.length).toBe(512)
		expect(ua.value).toBe('A'.repeat(512))
	})

	it('Should reconstitute a UserAgent from DB without alteration', () => {
		const ua = UserAgent.reconstitute('Mozilla/5.0 CustomBot')
		expect(ua.value).toBe('Mozilla/5.0 CustomBot')
	})

	it('Should correctly parse browser, os, and device for macOS Chrome UserAgent', () => {
		const ua = UserAgent.create(validUserAgentStr)
		expect(ua.browser).toBe('Chrome')
		expect(ua.os).toBe('macOS')
		expect(ua.device).toBe('desktop')
	})

	it('Should correctly parse browser, os, and device for iPhone Safari UserAgent', () => {
		const iphoneUaStr =
			'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1'
		const ua = UserAgent.create(iphoneUaStr)
		expect(ua.browser).toBe('Safari')
		expect(ua.os).toBe('iOS')
		expect(ua.device).toBe('mobile')
	})

	it('Should correctly parse browser, os, and device for Android Chrome UserAgent', () => {
		const androidUaStr =
			'Mozilla/5.0 (Linux; Android 13; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
		const ua = UserAgent.create(androidUaStr)
		expect(ua.browser).toBe('Chrome')
		expect(ua.os).toBe('Android')
		expect(ua.device).toBe('mobile')
	})

	it('Should fall back to unknown for browser, os, and device when UserAgent is unknown or empty', () => {
		const ua = UserAgent.create(null)
		expect(ua.browser).toBe('unknown')
		expect(ua.os).toBe('unknown')
		expect(ua.device).toBe('unknown')
	})
})

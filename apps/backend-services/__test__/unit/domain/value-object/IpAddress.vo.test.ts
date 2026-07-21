import { describe, expect, it } from 'vitest'
import { IpAddress } from '@/core/domain/value-objects/ip-address/IpAddress.vo.ts'
import { InvalidIpAddressError } from '@/core/domain/errors/domain.errors.ts'

describe('IpAddress Value Object', () => {
	it.each([
		['192.168.1.1', 'Standard IPv4'],
		['127.0.0.1', 'IPv4 loopback'],
		['::1', 'IPv6 loopback'],
		['2001:db8::1', 'Compressed IPv6'],
		['2001:db8:0:0:0:0:0:1', 'Full IPv6'],
	])('Should create IpAddress for a valid IP - %s (%s)', (ip) => {
		const ipAddress = IpAddress.create(ip)
		expect(ipAddress.ipAddress).toBe(ip)
	})

	it.each([
		['', 'Empty string'],
		['invalid-ip', 'Invalid format'],
		['256.0.0.1', 'Invalid IP segment (too large)'],
		['192.168.1', 'Incomplete IPv4 (missing segment)'],
		['[IP_ADDRESS]', 'Invalid IPv6 format (missing colons)'],
		['2001:db8::1::1', 'Invalid IPv6 (too many double colons)'],
	])('Should throw error for invalid IP - %s (%s)', (ip) => {
		expect(() => IpAddress.create(ip)).toThrow(InvalidIpAddressError)
	})

	it('Should return unknown for invalid IP in the createOrUnknown method', () => {
		const ipAddress = IpAddress.createOrUnknown('invalid-ip')
		expect(ipAddress.ipAddress).toBe('unknown')
	})
})

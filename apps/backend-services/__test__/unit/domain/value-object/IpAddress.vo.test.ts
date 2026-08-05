import { describe, expect, it } from 'vitest'
import { IpAddress } from '@/core/domain/value-objects/ip-address/IpAddress.vo.ts'

describe('IpAddress Value Object', () => {
	it.each([
		['192.168.1.1', 'Standard IPv4'],
		['127.0.0.1', 'IPv4 loopback'],
		['::1', 'IPv6 loopback'],
		['2001:db8::1', 'Compressed IPv6'],
		['2001:db8:0:0:0:0:0:1', 'Full IPv6'],
	])('Should create IpAddress for a valid IP - %s (%s)', (ip) => {
		const ipAddress = IpAddress.createOrUnknown(ip)
		expect(ipAddress.ipAddress).toBe(ip)
	})

	it('Should return unknown for invalid IP in the createOrUnknown method', () => {
		const ipAddress = IpAddress.createOrUnknown('invalid-ip')
		expect(ipAddress.ipAddress).toBe('unknown')
	})

	it('Should return unknown for oversized IP string in createOrUnknown', () => {
		const longIp = '2001:db8::1%' + 'z'.repeat(34)
		const ipAddress = IpAddress.createOrUnknown(longIp)
		expect(ipAddress.ipAddress).toBe('unknown')
	})
})

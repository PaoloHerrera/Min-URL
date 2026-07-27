import { describe, expect, it } from 'vitest'
import { Visit } from '@/core/domain/entities/Visit.entity.ts'
import { IpAddress } from '@/core/domain/value-objects/ip-address/IpAddress.vo.ts'
import { UserAgent } from '@/core/domain/value-objects/user-agent/UserAgent.vo.ts'
import { Referer } from '@/core/domain/value-objects/referer/Referer.vo.ts'
import { InvalidVisitError } from '@/core/domain/errors/domain.errors.ts'

describe('Visit Entity (Unit Test)', () => {
	it('Should create a new Visit entity with auto-generated UUID v7 id and visitedAt timestamp', () => {
		const shortUrlId = '01908234-5678-7000-8000-000000000001'
		const ipAddress = IpAddress.createOrUnknown('127.0.0.1')
		const userAgent = UserAgent.create(
			'Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0',
		)
		const referer = Referer.create('https://tiktok.com/video-1')

		const visit = Visit.create({
			shortUrlId,
			ipAddress,
			userAgent,
			referer,
		})

		expect(visit.id).toBeDefined()
		expect(typeof visit.id).toBe('string')
		expect(visit.shortUrlId).toBe(shortUrlId)
		expect(visit.ipAddress).toBe(ipAddress)
		expect(visit.userAgent).toBe(userAgent)
		expect(visit.referer).toBe(referer)
		expect(visit.visitedAt).toBeInstanceOf(Date)
	})

	it('Should throw InvalidVisitError when shortUrlId is empty or whitespace', () => {
		expect(() =>
			Visit.create({
				shortUrlId: '   ',
				ipAddress: IpAddress.createOrUnknown('127.0.0.1'),
				userAgent: UserAgent.create('Mozilla/5.0...'),
				referer: Referer.create('direct'),
			}),
		).toThrow(InvalidVisitError)
	})

	it('Should default optional VOs to unknown IP, unknown UA, and direct Referer if omitted', () => {
		const visit = Visit.create({
			shortUrlId: 'shorturl-uuid-123',
		})

		expect(visit.ipAddress.ipAddress).toBe('unknown')
		expect(visit.userAgent.value).toBe('unknown')
		expect(visit.referer.value).toBe('direct')
		expect(visit.visitedAt).toBeInstanceOf(Date)
	})

	it('Should reconstitute a Visit entity from stored database props', () => {
		const fixedDate = new Date('2026-07-25T12:00:00Z')
		const visit = Visit.reconstitute({
			id: 'visit-uuid-123',
			shortUrlId: 'shorturl-uuid-456',
			ipAddress: IpAddress.createOrUnknown('192.168.1.1'),
			userAgent: UserAgent.create('Mozilla/5.0...'),
			referer: Referer.create('https://google.com'),
			visitedAt: fixedDate,
		})

		expect(visit.id).toBe('visit-uuid-123')
		expect(visit.shortUrlId).toBe('shorturl-uuid-456')
		expect(visit.visitedAt).toEqual(fixedDate)
	})
})

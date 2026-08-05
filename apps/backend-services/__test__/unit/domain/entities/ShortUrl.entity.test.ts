import { describe, expect, it } from 'vitest'
import { ShortUrl } from '@/core/domain/entities/ShortUrl.entity.ts'
import { IpAddress } from '@/core/domain/value-objects/ip-address/IpAddress.vo.ts'
import { Slug } from '@/core/domain/value-objects/slug/Slug.vo.ts'
import { TargetUrl } from '@/core/domain/value-objects/target-url/TargetUrl.vo.ts'

const dateFields = [
	'createdAt',
	'updatedAt',
	'expirationDate',
	'expiredAt',
	'deletedAt',
] as const

const makePopulatedShortUrl = (inputDate: Date) => {
	return ShortUrl.reconstitute({
		id: '01900000-0000-7000-8000-000000000001',
		slug: Slug.create('defensive'),
		originalUrl: TargetUrl.create('https://www.google.com'),
		ipAddress: IpAddress.createOrUnknown('127.0.0.1'),
		title: 'Defensive Test',
		purpose: 'direct',
		clicksCount: 0,
		expirationDate: inputDate,
		expiredAt: inputDate,
		createdAt: inputDate,
		updatedAt: inputDate,
		deletedAt: inputDate,
	})
}

describe('ShortUrl Entity (Unit Test)', () => {
	describe('Defensive Date Copying', () => {
		it.each(dateFields)(
			'Should prevent external mutation of %s via constructor input',
			(field) => {
				const mutableInputDate = new Date('2026-01-01T00:00:00Z')
				const shortUrl = makePopulatedShortUrl(mutableInputDate)

				mutableInputDate.setTime(0)

				const propertyDate = shortUrl[field] as Date
				expect(propertyDate.getTime()).not.toBe(0)
				expect(propertyDate.getTime()).toBe(
					new Date('2026-01-01T00:00:00Z').getTime(),
				)
			},
		)

		it.each(dateFields)(
			'Should prevent external mutation of %s via getter output',
			(field) => {
				const inputDate = new Date('2026-01-01T00:00:00Z')
				const shortUrl = makePopulatedShortUrl(inputDate)

				const retrievedDate = shortUrl[field] as Date
				retrievedDate.setTime(0)

				const newRetrievedDate = shortUrl[field] as Date
				expect(newRetrievedDate.getTime()).not.toBe(0)
				expect(newRetrievedDate.getTime()).toBe(inputDate.getTime())
			},
		)
	})

	describe('Domain Methods State Transitions', () => {
		it('Should transition isDeleted to true when delete() is called', () => {
			const shortUrl = ShortUrl.create({
				slug: Slug.create('deleteme'),
				originalUrl: TargetUrl.create('https://www.google.com'),
				ipAddress: IpAddress.createOrUnknown('127.0.0.1'),
				title: 'Delete Test',
				purpose: 'direct',
			})

			expect(shortUrl.isDeleted()).toBe(false)
			expect(shortUrl.deletedAt).toBeNull()

			shortUrl.delete()

			expect(shortUrl.isDeleted()).toBe(true)
			expect(shortUrl.deletedAt).toBeInstanceOf(Date)
		})

		it('Should set expiredAt defensively and transition isExpired correctly', () => {
			const shortUrl = ShortUrl.create({
				slug: Slug.create('expireme'),
				originalUrl: TargetUrl.create('https://www.google.com'),
				ipAddress: IpAddress.createOrUnknown('127.0.0.1'),
				title: 'Expire Test',
				purpose: 'direct',
			})

			expect(shortUrl.isExpired()).toBe(false)

			const pastDate = new Date('2020-01-01T00:00:00Z')
			shortUrl.setExpired(pastDate)
			pastDate.setTime(0)

			expect(shortUrl.isExpired()).toBe(true)
			expect(shortUrl.expiredAt?.getTime()).toBe(
				new Date('2020-01-01T00:00:00Z').getTime(),
			)
		})
	})
})

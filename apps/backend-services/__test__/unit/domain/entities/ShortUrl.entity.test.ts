import { describe, it, expect } from 'vitest'
import { ShortUrl } from '@/core/domain/entities/ShortUrl.entity.ts'
import { TargetUrl } from '@/core/domain/value-objects/target-url/TargetUrl.vo.ts'
import { Slug } from '@/core/domain/value-objects/slug/Slug.vo.ts'
import { IpAddress } from '@/core/domain/value-objects/ip-address/IpAddress.vo.ts'
import { Password } from '@/core/domain/value-objects/password/Password.vo.ts'

describe('ShortUrl Entity (Unit Test)', () => {
	it('Should create ShortUrl entity successfully without password', () => {
		const slug = Slug.create('google')
		const originalUrl = TargetUrl.create('https://www.google.com')
		const ipAddress = IpAddress.create('192.168.1.1')
		const title = 'Google'
		const purpose = 'direct' as const

		const shortUrl = ShortUrl.create({
			slug,
			originalUrl,
			ipAddress,
			title,
			purpose,
		})

		expect(shortUrl).not.toBeNull()
		expect(shortUrl.id).toBeDefined()
		expect(shortUrl.slug.value).toBe(slug.value)
		expect(shortUrl.originalUrl.value).toBe(originalUrl.value)
		expect(shortUrl.ipAddress.ipAddress).toBe('192.168.1.1')
		expect(shortUrl.title).toBe(title)
		expect(shortUrl.purpose).toBe(purpose)
		expect(shortUrl.clicksCount).toBe(0)
		expect(shortUrl.passwordHash).toBeNull()
		expect(shortUrl.expiredAt).toBeNull()
	})

	it('Should create ShortUrl entity successfully with passwordHash', () => {
		const slug = Slug.create('protected')
		const originalUrl = TargetUrl.create('https://www.google.com')
		const ipAddress = IpAddress.create('192.168.1.1')
		const title = 'Protected Google'
		const purpose = 'direct' as const
		const passwordHash = Password.reconstitute('fakesalt:fakehash')

		const shortUrl = ShortUrl.create({
			slug,
			originalUrl,
			ipAddress,
			title,
			purpose,
			passwordHash,
		})

		expect(shortUrl.passwordHash).not.toBeNull()
		expect(shortUrl.passwordHash?.hash).toBe('fakesalt:fakehash')
	})
})

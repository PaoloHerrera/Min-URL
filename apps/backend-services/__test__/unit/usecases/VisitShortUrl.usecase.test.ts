import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { VisitShortUrlUseCase } from '../../../src/core/usecases/VisitShortUrl.usecase.ts'
import type { UrlRepository } from '../../../src/core/ports/UrlRepository.interface.ts'
import { ShortUrl } from '../../../src/core/domain/entities/ShortUrl.entity.ts'
import { TargetUrl } from '../../../src/core/domain/value-objects/target-url/TargetUrl.vo.ts'
import { Slug } from '../../../src/core/domain/value-objects/slug/Slug.vo.ts'
import { IpAddress } from '../../../src/core/domain/value-objects/ip-address/IpAddress.vo.ts'
import { Password } from '../../../src/core/domain/value-objects/password/Password.vo.ts'

// Shared base for reconstituting ShortUrl fixtures from the DB
const baseShortUrlProps = {
	originalUrl: TargetUrl.reconstitute('https://www.google.com'),
	ipAddress: IpAddress.reconstitute({
		ipAddress: '127.0.0.1',
		geolocation: null,
	}),
	purpose: 'direct' as const,
	passwordHash: null,
	createdAt: new Date(),
	updatedAt: new Date(),
	deletedAt: null,
}

describe('VisitShortUrlUseCase (Unit Test)', () => {
	let mockUrlRepository: UrlRepository
	let useCase: VisitShortUrlUseCase

	beforeEach(() => {
		mockUrlRepository = {
			getUrlBySlug: vi.fn(),
			save: vi.fn(),
			isSlugAvailable: vi.fn(),
		}
		useCase = new VisitShortUrlUseCase(mockUrlRepository)
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	it('Should return the url metadata and originalUrl if slug exists and is public', async () => {
		vi.mocked(mockUrlRepository.getUrlBySlug).mockResolvedValue(
			ShortUrl.reconstitute({
				...baseShortUrlProps,
				id: 'test-id-1',
				slug: Slug.reconstitute('google'),
				title: 'Google',
				originalUrl: TargetUrl.reconstitute('https://www.google.com'),
			}),
		)

		const result = await useCase.execute({ slug: 'google' })

		expect(result).not.toBeNull()
		expect(result?.originalUrl).toBe('https://www.google.com')
		expect(result?.slug).toBe('google')
		expect(result?.password).toBe(false)
		expect(result?.queryAt).toBeDefined()
	})

	it('Should return password:true and omit originalUrl if slug is password-protected', async () => {
		vi.mocked(mockUrlRepository.getUrlBySlug).mockResolvedValue(
			ShortUrl.reconstitute({
				...baseShortUrlProps,
				id: 'test-id-2',
				slug: Slug.reconstitute('private'),
				title: 'Private',
				originalUrl: TargetUrl.reconstitute('https://www.private-site.com'),
				passwordHash: Password.reconstitute('fakesalt:fakehash'),
			}),
		)

		const result = await useCase.execute({ slug: 'private' })

		expect(result).not.toBeNull()
		expect(result?.originalUrl).toBeUndefined()
		expect(result?.slug).toBe('private')
		expect(result?.password).toBe(true)
		expect(result?.queryAt).toBeDefined()
	})

	it('Should return null if slug does not exist', async () => {
		vi.mocked(mockUrlRepository.getUrlBySlug).mockResolvedValue(null)

		const result = await useCase.execute({ slug: 'notexists' })

		expect(result).toBeNull()
	})

	it('Should return null if slug is expired', async () => {
		vi.mocked(mockUrlRepository.getUrlBySlug).mockResolvedValue(
			ShortUrl.reconstitute({
				...baseShortUrlProps,
				id: 'test-id-3',
				slug: Slug.reconstitute('expire'),
				title: 'Expired',
				originalUrl: TargetUrl.reconstitute('https://www.expired.com'),
				expiredAt: new Date(Date.now() - 10_000), // Expirado hace 10 segundos
			}),
		)

		const result = await useCase.execute({ slug: 'expire' })

		expect(result).toBeNull()
	})

	it('Should return null if slug is deleted', async () => {
		vi.mocked(mockUrlRepository.getUrlBySlug).mockResolvedValue(
			ShortUrl.reconstitute({
				...baseShortUrlProps,
				id: 'test-id-4',
				slug: Slug.reconstitute('delete'),
				title: 'Deleted',
				originalUrl: TargetUrl.reconstitute('https://www.deleted.com'),
				deletedAt: new Date(),
			}),
		)

		const result = await useCase.execute({ slug: 'delete' })

		expect(result).toBeNull()
	})
})

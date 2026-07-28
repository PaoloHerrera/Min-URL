import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { VisitShortUrl } from '@/core/usecases/VisitShortUrl.usecase.ts'
import type { ShortUrlRepositoryPort } from '@/core/ports/outbound/ShortUrlRepositoryPort.interface.ts'
import type { VisitRepositoryPort } from '@/core/ports/outbound/VisitRepositoryPort.interface.ts'
import { ShortUrl } from '@/core/domain/entities/ShortUrl.entity.ts'
import { TargetUrl } from '@/core/domain/value-objects/target-url/TargetUrl.vo.ts'
import { Slug } from '@/core/domain/value-objects/slug/Slug.vo.ts'
import { IpAddress } from '@/core/domain/value-objects/ip-address/IpAddress.vo.ts'
import { Password } from '@/core/domain/value-objects/password/Password.vo.ts'
import {
	SlugNotFoundError,
	SlugIsExpiredError,
	SlugIsDeletedError,
} from '@/core/domain/errors/domain.errors.ts'

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
	let mockUrlRepository: ShortUrlRepositoryPort
	let mockVisitRepository: VisitRepositoryPort
	let useCase: VisitShortUrl

	beforeEach(() => {
		mockUrlRepository = {
			getUrlBySlug: vi.fn(),
			isSlugAvailable: vi.fn(),
		} as unknown as ShortUrlRepositoryPort
		mockVisitRepository = {
			save: vi.fn(),
		}
		useCase = new VisitShortUrl(mockUrlRepository, mockVisitRepository)
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	it('Should return the url metadata, originalUrl and save Visit event when slug exists and is public', async () => {
		vi.mocked(mockUrlRepository.getUrlBySlug).mockResolvedValue(
			ShortUrl.reconstitute({
				...baseShortUrlProps,
				id: 'test-id-1',
				slug: Slug.reconstitute('google'),
				title: 'Google',
				originalUrl: TargetUrl.reconstitute('https://www.google.com'),
			}),
		)

		const result = await useCase.execute({
			slug: 'google',
			ipAddress: '200.1.2.3',
			userAgent:
				'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
			referer: 'https://t.co/abc',
		})

		expect(result).not.toBeNull()
		expect(result.originalUrl.value).toBe('https://www.google.com')
		expect(result.slug.value).toBe('google')
		expect(result.passwordHash).toBeNull()

		// Verify Visit entity persistence with correct shortUrlId
		expect(mockVisitRepository.save).toHaveBeenCalledTimes(1)
		const savedVisit = vi.mocked(mockVisitRepository.save).mock.calls[0][0]
		expect(savedVisit.shortUrlId).toBe('test-id-1')
		expect(savedVisit.ipAddress.ipAddress).toBe('200.1.2.3')
		expect(savedVisit.userAgent.browser).toBe('Safari')
		expect(savedVisit.userAgent.os).toBe('iOS')
		expect(savedVisit.referer.domain).toBe('t.co')

		// The atomic clicks_count increment happens inside DrizzleVisitRepository.save()
		// via a DB transaction — not via shortUrlRepository.save().
		expect(mockUrlRepository.save).not.toBeDefined()
	})

	it('Should return ShortUrl entity with passwordHash and save Visit event if slug is password-protected', async () => {
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

		const result = await useCase.execute({
			slug: 'private',
			ipAddress: '1.1.1.1',
			userAgent: 'Mozilla/5.0 (Windows NT 10.0)',
			referer: 'direct',
		})

		expect(result).not.toBeNull()
		expect(result.originalUrl.value).toBe('https://www.private-site.com')
		expect(result.slug.value).toBe('private')
		expect(result.passwordHash).not.toBeNull()
		expect(mockVisitRepository.save).toHaveBeenCalledTimes(1)
	})

	it('Should throw SlugNotFoundError and NOT save Visit if slug does not exist', async () => {
		vi.mocked(mockUrlRepository.getUrlBySlug).mockResolvedValue(null)

		await expect(useCase.execute({ slug: 'notexists' })).rejects.toThrow(
			SlugNotFoundError,
		)
		expect(mockVisitRepository.save).not.toHaveBeenCalled()
	})

	it('Should throw SlugIsExpiredError and NOT save Visit if slug is expired', async () => {
		vi.mocked(mockUrlRepository.getUrlBySlug).mockResolvedValue(
			ShortUrl.reconstitute({
				...baseShortUrlProps,
				id: 'test-id-3',
				slug: Slug.reconstitute('expire'),
				title: 'Expired',
				originalUrl: TargetUrl.reconstitute('https://www.expired.com'),
				expiredAt: new Date(Date.now() - 10_000),
			}),
		)

		await expect(useCase.execute({ slug: 'expire' })).rejects.toThrow(
			SlugIsExpiredError,
		)
		expect(mockVisitRepository.save).not.toHaveBeenCalled()
	})

	it('Should throw SlugIsDeletedError and NOT save Visit if slug is deleted', async () => {
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

		await expect(useCase.execute({ slug: 'delete' })).rejects.toThrow(
			SlugIsDeletedError,
		)
		expect(mockVisitRepository.save).not.toHaveBeenCalled()
	})
})

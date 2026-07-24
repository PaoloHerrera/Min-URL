import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { VisitShortUrl } from '@/core/usecases/VisitShortUrl.usecase.ts'
import type { ShortUrlRepositoryPort } from '@/core/ports/outbound/ShortUrlRepositoryPort.interface.ts'
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
	let useCase: VisitShortUrl

	beforeEach(() => {
		mockUrlRepository = {
			getUrlBySlug: vi.fn(),
			save: vi.fn(),
			isSlugAvailable: vi.fn(),
		}
		useCase = new VisitShortUrl(mockUrlRepository)
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
		expect(result.originalUrl.value).toBe('https://www.google.com')
		expect(result.slug.value).toBe('google')
		expect(result.passwordHash).toBeNull()
	})

	it('Should return ShortUrl entity with passwordHash if slug is password-protected', async () => {
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
		expect(result.originalUrl.value).toBe('https://www.private-site.com')
		expect(result.slug.value).toBe('private')
		expect(result.passwordHash).not.toBeNull()
	})

	it('Should throw SlugNotFoundError if slug does not exist', async () => {
		vi.mocked(mockUrlRepository.getUrlBySlug).mockResolvedValue(null)

		await expect(useCase.execute({ slug: 'notexists' })).rejects.toThrow(
			SlugNotFoundError,
		)
	})

	it('Should throw SlugIsExpiredError if slug is expired', async () => {
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

		await expect(useCase.execute({ slug: 'expire' })).rejects.toThrow(
			SlugIsExpiredError,
		)
	})

	it('Should throw SlugIsDeletedError if slug is deleted', async () => {
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
	})
})

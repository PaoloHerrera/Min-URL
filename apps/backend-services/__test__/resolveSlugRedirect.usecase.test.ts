import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ResolveSlugRedirectUseCase } from '../src/core/usecases/resolveSlugRedirect.usecase.ts'
import type { UrlRepository } from '../src/core/ports/UrlRepository.interface.ts'
import { ShortUrl } from '../src/core/domain/entities/ShortUrl.ts'

describe('ResolveSlugRedirectUseCase (Unit Test)', () => {
	let mockUrlRepository: UrlRepository
	let useCase: ResolveSlugRedirectUseCase

	beforeEach(() => {
		mockUrlRepository = {
			getUrlBySlug: vi.fn(),
			save: vi.fn(),
			isSlugAvailable: vi.fn(),
		}
		useCase = new ResolveSlugRedirectUseCase(mockUrlRepository)
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	it('Should return the url metadata and originalUrl if slug exist and is public', async () => {
		vi.mocked(mockUrlRepository.getUrlBySlug).mockResolvedValue(
			ShortUrl.create({
				slug: 'google',
				title: 'Google',
				originalUrl: 'https://www.google.com',
				purpose: 'direct',
				passwordHash: null,
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
			}),
		)

		const result = await useCase.execute({ slug: 'google' })

		expect(result).not.toBeNull()
		expect(result?.originalUrl).toBe('https://www.google.com')
		expect(result?.slug).toBe('google')
		expect(result?.password).toBe(false)
		expect(result?.queryAt).toBeDefined()
	})

	it('Should return password true and OMIT originalUrl if slug is password protected', async () => {
		vi.mocked(mockUrlRepository.getUrlBySlug).mockResolvedValue(
			ShortUrl.create({
				slug: 'private',
				title: 'Private',
				originalUrl: 'https://www.private-site.com',
				purpose: 'direct',
				passwordHash: 'hashed-password',
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
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
			ShortUrl.create({
				slug: 'expired',
				title: 'Expired',
				originalUrl: 'https://www.expired.com',
				purpose: 'direct',
				passwordHash: null,
				expiredAt: new Date(Date.now() - 10000), // Expirado hace 10 segundos
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
			}),
		)

		const result = await useCase.execute({ slug: 'expired' })

		expect(result).toBeNull()
	})

	it('Should return null if slug is deleted', async () => {
		vi.mocked(mockUrlRepository.getUrlBySlug).mockResolvedValue(
			ShortUrl.create({
				slug: 'deleted',
				title: 'Deleted',
				originalUrl: 'https://www.deleted.com',
				purpose: 'direct',
				passwordHash: null,
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: new Date(), // Borrado ahora
			}),
		)

		const result = await useCase.execute({ slug: 'deleted' })

		expect(result).toBeNull()
	})
})

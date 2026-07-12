import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { GetUrlMetadataUseCase } from '../src/core/usecases/getUrlMetadata.usecase.ts'
import type { UrlRepository } from '../src/core/ports/UrlRepository.interface.ts'

describe('GetUrlMetadataUseCase (Unit Test)', () => {
	let mockUrlRepository: UrlRepository
	let useCase: GetUrlMetadataUseCase

	beforeEach(() => {
		mockUrlRepository = {
			getUrlBySlug: vi.fn(),
			createAnonymous: vi.fn(),
			isSlugAvailable: vi.fn(),
		}
		useCase = new GetUrlMetadataUseCase(mockUrlRepository)
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	it('Should return the url metadata and originalUrl if slug exist and is public', async () => {
		vi.mocked(mockUrlRepository.getUrlBySlug).mockResolvedValue({
			id_urls: 'url-123',
			long_url: 'https://www.google.com',
			slug: 'google',
			purpose: 'direct',
			password: false,
			created_at: new Date(Date.now()),
			expired: false,
			deleted: false,
		})

		const result = await useCase.execute({ slug: 'google' })

		expect(result).not.toBeNull()
		expect(result?.originalUrl).toBe('https://www.google.com')
		expect(result?.slug).toBe('google')
		expect(result?.password).toBe(false)
		expect(result?.createdAt).toBeDefined()
		expect(result?.queryAt).toBeDefined()
	})

	it('Should return password true and OMIT originalUrl if slug is password protected', async () => {
		vi.mocked(mockUrlRepository.getUrlBySlug).mockResolvedValue({
			id_urls: 'url-123',
			long_url: 'https://www.private-site.com',
			slug: 'private',
			purpose: 'direct',
			password: true,
			created_at: new Date(Date.now()),
			expired: false,
			deleted: false,
		})

		const result = await useCase.execute({ slug: 'private' })

		expect(result).not.toBeNull()
		expect(result?.originalUrl).toBeUndefined()
		expect(result?.slug).toBe('private')
		expect(result?.password).toBe(true)
		expect(result?.createdAt).toBeUndefined()
		expect(result?.queryAt).toBeDefined()
	})

	it('Should return null if slug does not exist', async () => {
		vi.mocked(mockUrlRepository.getUrlBySlug).mockResolvedValue(null)

		const result = await useCase.execute({ slug: 'notexists' })

		expect(result).toBeNull()
	})

	it('Should return null if slug is expired', async () => {
		vi.mocked(mockUrlRepository.getUrlBySlug).mockResolvedValue({
			id_urls: 'url-123',
			long_url: 'https://www.expired.com',
			slug: 'expired',
			purpose: 'direct',
			password: false,
			created_at: new Date(Date.now()),
			expired: true,
			deleted: false,
		})

		const result = await useCase.execute({ slug: 'expired' })

		expect(result).toBeNull()
	})

	it('Should return null if slug is deleted', async () => {
		vi.mocked(mockUrlRepository.getUrlBySlug).mockResolvedValue({
			id_urls: 'url-123',
			long_url: 'https://www.deleted.com',
			slug: 'deleted',
			purpose: 'direct',
			password: false,
			created_at: new Date(Date.now()),
			expired: false,
			deleted: true,
		})

		const result = await useCase.execute({ slug: 'deleted' })

		expect(result).toBeNull()
	})
})

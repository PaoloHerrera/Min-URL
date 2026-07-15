import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ShortenUrlAnonymousUseCase } from '../src/core/usecases/shortenUrlAnonymous.usecase.js'
import type { UrlRepository } from '../src/core/ports/UrlRepository.interface.ts'
import type { CaptchaServices } from '../src/core/ports/CaptchaServices.interface.ts'
import type { GeolocationsServices } from '../src/core/ports/geolocationServices.interface.ts'
import type { SlugGenerator } from '../src/core/ports/SlugGenerator.interface.ts'

describe('ShortenUrlAnonymousUseCase', () => {
	//1. ARRANGE: Setup mock port implementations
	let mockUrlRepository: UrlRepository
	let mockCaptchaServices: CaptchaServices
	let mockGeolocationServices: GeolocationsServices
	let mockSlugGenerator: SlugGenerator
	let useCase: ShortenUrlAnonymousUseCase

	beforeEach(() => {
		mockUrlRepository = {
			createAnonymous: vi.fn().mockResolvedValue({
				id_urls: 'uuid-1234',
				long_url: 'https://google.com',
				slug: 'xyz123',
				created_at: new Date(),
			}),
			isSlugAvailable: vi.fn().mockResolvedValue(true),
			getUrlBySlug: vi.fn().mockResolvedValue(null),
		}

		mockCaptchaServices = {
			verify: vi.fn().mockResolvedValue(true),
		}

		mockGeolocationServices = {
			getOrCreate: vi.fn().mockResolvedValue({
				id_geolocations: 'geo-uuid-456',
			}),
		}

		mockSlugGenerator = {
			generateUniqueSlug: vi.fn().mockResolvedValue('xyz123'),
		}

		// Instantiate the use case with the mock dependencies
		useCase = new ShortenUrlAnonymousUseCase(
			mockUrlRepository,
			mockCaptchaServices,
			mockGeolocationServices,
			mockSlugGenerator,
		)
	})

	it('Should successfully create an anonymous short URL', async () => {
		//2. ACT - Execute the use case
		const result = await useCase.execute({
			originalUrl: 'https://google.com',
			captchaToken: 'valid-token',
			clientIp: '127.0.0.1',
		})

		//3. ASSERT - Check the results
		expect(mockCaptchaServices.verify).toHaveBeenCalledWith('valid-token')
		expect(mockGeolocationServices.getOrCreate).toHaveBeenCalledWith(
			'127.0.0.1',
		)
		expect(mockSlugGenerator.generateUniqueSlug).toHaveBeenCalledWith(
			'https://google.com',
		)
		expect(mockUrlRepository.createAnonymous).toHaveBeenCalledWith(
			'https://google.com',
			'xyz123',
			'geo-uuid-456',
		)

		expect(result).toEqual({
			originalUrl: 'https://google.com',
			slug: 'xyz123',
			createdAt: expect.any(Date),
		})
	})

	it('Should throw an error if the captcha verification fails', async () => {
		vi.mocked(mockCaptchaServices.verify).mockResolvedValue(false)

		await expect(
			useCase.execute({
				originalUrl: 'https://google.com',
				captchaToken: 'invalid-token',
				clientIp: '127.0.0.1',
			}),
		).rejects.toThrow('Invalid captcha token')
	})

	it('Should throw an error if the slug is already taken', async () => {
		vi.mocked(mockCaptchaServices.verify).mockResolvedValue(true)
		vi.mocked(mockSlugGenerator.generateUniqueSlug).mockRejectedValue(
			new Error('Error creating Short URL. Please try again later.'),
		)

		await expect(
			useCase.execute({
				originalUrl: 'https://google.com',
				captchaToken: 'valid-token',
				clientIp: '127.0.0.1',
			}),
		).rejects.toThrow('Error creating Short URL. Please try again later.')
	})
})

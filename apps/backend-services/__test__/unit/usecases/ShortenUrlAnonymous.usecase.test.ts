import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ShortenUrlAnonymous } from '@/core/usecases/ShortenUrlAnonymous.usecase.ts'
import type { ShortUrlRepositoryPort } from '@/core/ports/outbound/ShortUrlRepositoryPort.interface.ts'
import type { CaptchaServicePort } from '@/core/ports/outbound/CaptchaServicePort.interface.ts'
import type { SlugGeneratorPort } from '@/core/ports/outbound/SlugGeneratorPort.interface.ts'
import type { ForbiddenExtensionsPort } from '@/core/ports/outbound/ForbiddenExtensionsPort.interface.ts'
import type { IpGeolocationResolverPort } from '@/core/ports/outbound/IpGeolocationResolverPort.interface.ts'
import { ShortUrl } from '@/core/domain/entities/ShortUrl.entity.ts'
import { Geolocation } from '@/core/domain/value-objects/geolocation/Geolocation.vo.ts'

import {
	ForbiddenExtensionError,
	SlugAlreadyExistsError,
	SlugGenerationExhaustedError,
} from '@/core/domain/errors/domain.errors.ts'
import { CaptchaVerificationError } from '@/core/errors/application.errors.ts'

describe('ShortenUrlAnonymousUseCase', () => {
	let mockShortUrlRepository: ShortUrlRepositoryPort
	let mockCaptchaServices: CaptchaServicePort
	let mockSlugGenerator: SlugGeneratorPort
	let mockForbiddenExtensions: ForbiddenExtensionsPort
	let mockIpGeolocationResolver: IpGeolocationResolverPort
	let useCase: ShortenUrlAnonymous

	const validInput = {
		originalUrl: 'https://google.com',
		captchaToken: 'valid-token',
		clientIp: '127.0.0.1',
	}

	beforeEach(() => {
		mockShortUrlRepository = {
			save: vi.fn().mockResolvedValue(undefined),
			isSlugAvailable: vi.fn().mockResolvedValue(true),
			getUrlBySlug: vi.fn().mockResolvedValue(null),
		}

		mockCaptchaServices = {
			verify: vi.fn().mockResolvedValue(true),
		}

		mockSlugGenerator = {
			generateUniqueSlug: vi.fn().mockResolvedValue('abc1234'),
		}

		mockForbiddenExtensions = {
			check: vi.fn().mockReturnValue(false),
		}

		mockIpGeolocationResolver = {
			resolve: vi.fn().mockResolvedValue(
				Geolocation.create({
					country: 'Chile',
					region: 'Valparaíso',
					city: 'Viña del Mar',
					latitude: -33.0245,
					longitude: -71.5518,
					timezone: 'America/Santiago',
				}),
			),
		}

		useCase = new ShortenUrlAnonymous({
			shortUrlRepository: mockShortUrlRepository,
			captchaServices: mockCaptchaServices,
			slugGenerator: mockSlugGenerator,
			forbiddenExtensions: mockForbiddenExtensions,
			ipGeolocationResolver: mockIpGeolocationResolver,
		})
	})

	it('Should shorten a valid URL and return a ShortUrl entity', async () => {
		const result = await useCase.execute(validInput)

		expect(result).toBeInstanceOf(ShortUrl)
		expect(result.originalUrl.value).toBe(validInput.originalUrl)
		expect(result.slug.value).toBe('abc1234')
		expect(mockCaptchaServices.verify).toHaveBeenCalledWith(
			validInput.captchaToken,
		)
		expect(mockForbiddenExtensions.check).toHaveBeenCalled()
		expect(mockSlugGenerator.generateUniqueSlug).toHaveBeenCalled()
		expect(mockIpGeolocationResolver.resolve).toHaveBeenCalled()
		expect(mockShortUrlRepository.save).toHaveBeenCalledWith(result)
	})

	it('Should throw CaptchaVerificationError if captcha token is invalid', async () => {
		mockCaptchaServices.verify = vi.fn().mockResolvedValue(false)

		await expect(useCase.execute(validInput)).rejects.toThrow(
			CaptchaVerificationError,
		)
		expect(mockShortUrlRepository.save).not.toHaveBeenCalled()
	})

	it('Should throw ForbiddenExtensionError if target URL ends with a forbidden extension', async () => {
		mockForbiddenExtensions.check = vi.fn().mockReturnValue(true)

		await expect(
			useCase.execute({
				...validInput,
				originalUrl: 'https://malicious.com/virus.exe',
			}),
		).rejects.toThrow(ForbiddenExtensionError)
		expect(mockShortUrlRepository.save).not.toHaveBeenCalled()
	})

	it('Should propagate SlugGenerationExhaustedError if slug generator fails', async () => {
		mockSlugGenerator.generateUniqueSlug = vi
			.fn()
			.mockRejectedValue(new SlugGenerationExhaustedError())

		await expect(useCase.execute(validInput)).rejects.toThrow(
			SlugGenerationExhaustedError,
		)
		expect(mockShortUrlRepository.save).not.toHaveBeenCalled()
	})

	it('Should fall back to null geolocation if IP resolution fails or returns null', async () => {
		mockIpGeolocationResolver.resolve = vi.fn().mockResolvedValue(null)

		const result = await useCase.execute(validInput)

		expect(result).toBeInstanceOf(ShortUrl)
		expect(result.ipAddress.geolocation).toBeNull()
		expect(mockShortUrlRepository.save).toHaveBeenCalledWith(result)
	})

	it('Should retry saving with a new slug if ShortUrlRepository throws SlugAlreadyExistsError on initial attempt', async () => {
		mockShortUrlRepository.save = vi
			.fn()
			.mockRejectedValueOnce(new SlugAlreadyExistsError())
			.mockResolvedValueOnce(undefined)

		mockSlugGenerator.generateUniqueSlug = vi
			.fn()
			.mockResolvedValueOnce('slug11')
			.mockResolvedValueOnce('slug22')

		const result = await useCase.execute(validInput)

		expect(result).toBeInstanceOf(ShortUrl)
		expect(result.slug.value).toBe('slug22')
		expect(mockShortUrlRepository.save).toHaveBeenCalledTimes(2)
	})

	it('Should throw SlugAlreadyExistsError if all 3 retries fail due to continuous slug collisions', async () => {
		mockShortUrlRepository.save = vi
			.fn()
			.mockRejectedValue(new SlugAlreadyExistsError())

		await expect(useCase.execute(validInput)).rejects.toThrow(
			SlugAlreadyExistsError,
		)
		expect(mockShortUrlRepository.save).toHaveBeenCalledTimes(3)
	})
})

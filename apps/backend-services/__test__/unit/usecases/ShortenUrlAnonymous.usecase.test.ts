import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ShortenUrlAnonymousUseCase } from '../../../src/core/usecases/ShortenUrlAnonymous.usecase.ts'
import type { UrlRepository } from '../../../src/core/ports/UrlRepository.interface.ts'
import type { CaptchaServices } from '../../../src/core/ports/CaptchaServices.interface.ts'
import type { SlugGenerator } from '../../../src/core/ports/SlugGenerator.interface.ts'
import type { ForbiddenExtensions } from '../../../src/core/ports/ForbiddenExtensions.interface.ts'
import type { IpGeolocationResolver } from '../../../src/core/ports/IpGeolocationResolver.interface.ts'
import { ShortUrl } from '../../../src/core/domain/entities/ShortUrl.entity.ts'
import { Geolocation } from '../../../src/core/domain/value-objects/geolocation/Geolocation.vo.ts'

import {
	CaptchaVerificationError,
	ForbiddenExtensionError,
	SlugGenerationExhaustedError,
} from '../../../src/core/domain/errors/domain.errors.ts'

describe('ShortenUrlAnonymousUseCase', () => {
	let mockUrlRepository: UrlRepository
	let mockCaptchaServices: CaptchaServices
	let mockSlugGenerator: SlugGenerator
	let mockForbiddenExtensions: ForbiddenExtensions
	let mockIpGeolocationResolver: IpGeolocationResolver
	let useCase: ShortenUrlAnonymousUseCase

	const validInput = {
		originalUrl: 'https://google.com',
		captchaToken: 'valid-token',
		clientIp: '127.0.0.1',
	}

	beforeEach(() => {
		mockUrlRepository = {
			save: vi.fn().mockResolvedValue(undefined),
			isSlugAvailable: vi.fn().mockResolvedValue(true),
			getUrlBySlug: vi.fn().mockResolvedValue(null),
		}

		mockCaptchaServices = {
			verify: vi.fn().mockResolvedValue(true),
		}

		mockSlugGenerator = {
			generateUniqueSlug: vi.fn().mockResolvedValue('xyz123'),
		}

		mockForbiddenExtensions = {
			check: vi.fn().mockReturnValue(false),
		}

		mockIpGeolocationResolver = {
			resolve: vi.fn().mockReturnValue(
				Geolocation.create({
					country: 'US',
					region: 'CA',
					city: 'San Francisco',
					latitude: 37.7749,
					longitude: -122.4194,
				}),
			),
		}

		useCase = new ShortenUrlAnonymousUseCase({
			urlRepository: mockUrlRepository,
			captchaServices: mockCaptchaServices,
			slugGenerator: mockSlugGenerator,
			forbiddenExtensions: mockForbiddenExtensions,
			ipGeolocationResolver: mockIpGeolocationResolver,
		})
	})

	it('Should successfully create an anonymous short URL', async () => {
		const result = await useCase.execute(validInput)

		expect(mockCaptchaServices.verify).toHaveBeenCalledWith('valid-token')
		expect(mockSlugGenerator.generateUniqueSlug).toHaveBeenCalled()
		expect(mockUrlRepository.save).toHaveBeenCalledWith(expect.any(ShortUrl))
		expect(result.originalUrl.value).toBe('https://google.com')
		expect(result.ipAddress.ipAddress).toBe('127.0.0.1')
		expect(result.slug.value).toBe('xyz123')
	})

	it('Should store "unknown" ipAddress if clientIp is invalid or unavailable', async () => {
		const result = await useCase.execute({
			...validInput,
			clientIp: 'not-an-ip',
		})

		expect(result.ipAddress.ipAddress).toBe('unknown')
	})

	it('Should throw if captcha verification fails', async () => {
		vi.mocked(mockCaptchaServices.verify).mockResolvedValue(false)

		await expect(
			useCase.execute({ ...validInput, captchaToken: 'invalid-token' }),
		).rejects.toThrow(CaptchaVerificationError)
	})

	it('Should throw if slug generation fails', async () => {
		vi.mocked(mockSlugGenerator.generateUniqueSlug).mockRejectedValue(
			new SlugGenerationExhaustedError(),
		)

		await expect(useCase.execute(validInput)).rejects.toThrow(
			SlugGenerationExhaustedError,
		)
	})

	it('Should throw if target URL contains a forbidden extension', async () => {
		vi.mocked(mockForbiddenExtensions.check).mockReturnValue(true)

		await expect(
			useCase.execute({
				...validInput,
				originalUrl: 'https://google.com/malicious.exe',
			}),
		).rejects.toThrow(ForbiddenExtensionError)
	})
})

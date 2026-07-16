import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ShortenUrlAnonymousUseCase } from '../src/core/usecases/shortenUrlAnonymous.usecase.js'
import type { UrlRepository } from '../src/core/ports/UrlRepository.interface.ts'
import type { CaptchaServices } from '../src/core/ports/CaptchaServices.interface.ts'
import type { GeolocationRepository } from '../src/core/ports/GeolocationRepository.interface.ts'
import type { SlugGenerator } from '../src/core/ports/SlugGenerator.interface.ts'
import type { IpResolver } from '../src/core/ports/IpResolver.interface.ts'
import { ShortUrl } from '../src/core/domain/entities/ShortUrl.ts'
import { Geolocation } from '../src/core/domain/value-objects/Geolocation.ts'

describe('ShortenUrlAnonymousUseCase', () => {
	let mockUrlRepository: UrlRepository
	let mockCaptchaServices: CaptchaServices
	let mockGeolocationRepository: GeolocationRepository
	let mockSlugGenerator: SlugGenerator
	let mockIpResolver: IpResolver
	let useCase: ShortenUrlAnonymousUseCase

	beforeEach(() => {
		mockUrlRepository = {
			save: vi.fn().mockResolvedValue(undefined),
			isSlugAvailable: vi.fn().mockResolvedValue(true),
			getUrlBySlug: vi.fn().mockResolvedValue(null),
		}

		mockCaptchaServices = {
			verify: vi.fn().mockResolvedValue(true),
		}

		mockGeolocationRepository = {
			getByIp: vi.fn().mockResolvedValue(
				Geolocation.create({
					ipAddress: '127.0.0.1',
					country: 'US',
					city: 'New York',
					region: 'NY',
					latitude: 40.7128,
					longitude: -74.006,
					createdAt: new Date(),
					updatedAt: new Date(),
				}),
			),
			save: vi.fn().mockResolvedValue(undefined),
		}

		mockIpResolver = {
			resolve: vi.fn().mockReturnValue(
				Geolocation.create({
					ipAddress: '127.0.0.1',
					country: 'US',
					city: 'New York',
					region: 'NY',
					latitude: 40.7128,
					longitude: -74.006,
					createdAt: new Date(),
					updatedAt: new Date(),
				}),
			),
		}

		mockSlugGenerator = {
			generateUniqueSlug: vi.fn().mockResolvedValue('xyz123'),
		}

		useCase = new ShortenUrlAnonymousUseCase({
			urlRepository: mockUrlRepository,
			captchaServices: mockCaptchaServices,
			slugGenerator: mockSlugGenerator,
			ipResolver: mockIpResolver,
			geolocationRepository: mockGeolocationRepository,
		})
	})

	it('Should successfully create an anonymous short URL', async () => {
		const result = await useCase.execute({
			originalUrl: 'https://google.com',
			captchaToken: 'valid-token',
			clientIp: '127.0.0.1',
		})

		expect(mockCaptchaServices.verify).toHaveBeenCalledWith('valid-token')
		expect(mockGeolocationRepository.getByIp).toHaveBeenCalledWith('127.0.0.1')
		expect(mockSlugGenerator.generateUniqueSlug).toHaveBeenCalledWith(
			'https://google.com',
		)
		expect(mockUrlRepository.save).toHaveBeenCalledWith(expect.any(ShortUrl))

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

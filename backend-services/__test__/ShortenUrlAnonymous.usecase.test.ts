import { describe, expect, it, vi } from 'vitest'
import { ShortenUrlAnonymousUseCase } from '../src/core/usecases/ShortenUrlAnonymous.usecase.ts'

describe('ShortenUrlAnonymousUseCase', () => {
	it('should successfully create an anonymous short URL', async () => {
		//1. ARRANGE: Setup mock port implementations
		const mockUrlRepository = {
			createAnonymous: vi.fn().mockResolvedValue({
				id_urls: 'uuid-1234',
				long_url: 'https://google.com',
				slug: 'xyz123',
				created_at: new Date(),
			}),
		}

		const mockCaptchaServices = {
			verify: vi.fn().mockResolvedValue(true),
		}

		const mockGeolocationServices = {
			getOrCreate: vi.fn().mockResolvedValue({
				id_geolocations: 'geo-uuid-456',
			}),
		}

		const mockSlugGenerator = {
			generateUniqueSlug: vi.fn().mockResolvedValue('xyz123'),
		}

		// Instantiate the use case with the mock dependencies
		const useCase = new ShortenUrlAnonymousUseCase(
			mockUrlRepository as any,
			mockCaptchaServices as any,
			mockGeolocationServices as any,
			mockSlugGenerator as any,
		)

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
})

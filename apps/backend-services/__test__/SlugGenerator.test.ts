import { describe, expect, it, vi } from 'vitest'
import { RandomBase62SlugGenerator } from '../src/core/services/RandomBase62SlugGenerator.ts'
import type { UrlRepository } from '../src/core/ports/UrlRepository.interface.ts'

describe('GenerateUniqueSlugUseCase', () => {
	let mockUrlRepository: UrlRepository

	it('Should generate an unique slug with minimal length', async () => {
		//1. ARRANGE: Mock reposotory (SlugGenerator's port)
		mockUrlRepository = {
			save: vi.fn().mockResolvedValue(undefined),
			isSlugAvailable: vi.fn().mockResolvedValue(true),
			getUrlBySlug: vi.fn().mockResolvedValue(null),
		}

		//Config for the slug generator
		const config = {
			initialLength: 6,
			maxLength: 12,
			maxAttempts: 3,
		}

		// Instantiate the slug generator
		const generator = new RandomBase62SlugGenerator(mockUrlRepository, config)

		//2. ACT: call the generator
		const slug = await generator.generateUniqueSlug('https://google.com')

		//3. ASSERT: check the slug
		expect(slug).toBeDefined()
		expect(mockUrlRepository.isSlugAvailable).toHaveBeenCalledTimes(1)
		expect(slug).toHaveLength(6)
	})

	it('Should retry up to maxAttempts and return a slug of initial length if becomes available', async () => {
		//1. ARRANGE: slug unavailable at first and second attempts, but available at third attempt (maxAttempts)
		mockUrlRepository = {
			isSlugAvailable: vi
				.fn()
				.mockResolvedValueOnce(false) // First attempt
				.mockResolvedValueOnce(false) // Second attempt
				.mockResolvedValueOnce(true), // Third attempt
			save: vi.fn().mockResolvedValue(undefined),
			getUrlBySlug: vi.fn().mockResolvedValue(null),
		}

		//Config for the slug generator
		const config = {
			initialLength: 6,
			maxLength: 12,
			maxAttempts: 3,
		}

		// Instantiate the slug generator
		const generator = new RandomBase62SlugGenerator(mockUrlRepository, config)

		//2. ACT: call the generator
		const slug = await generator.generateUniqueSlug('https://google.com')

		//3. ASSERT: check the slug
		expect(slug).toBeDefined()
		expect(slug).toHaveLength(6)
		expect(mockUrlRepository.isSlugAvailable).toHaveBeenCalledTimes(3)
	})

	it('Should increase slug length if maxAttempts is exceeded for the current length', async () => {
		//1. ARRANGE: 3 colisions for length 6, and success for length 7

		mockUrlRepository = {
			isSlugAvailable: vi
				.fn()
				.mockResolvedValueOnce(false)
				.mockResolvedValueOnce(false)
				.mockResolvedValueOnce(false)
				.mockResolvedValueOnce(true),
			save: vi.fn().mockResolvedValue(undefined),
			getUrlBySlug: vi.fn().mockResolvedValue(null),
		}

		//Config for the slug generator
		const config = {
			initialLength: 6,
			maxLength: 12,
			maxAttempts: 3,
		}

		// Instantiate the slug generator
		const generator = new RandomBase62SlugGenerator(mockUrlRepository, config)

		//2. ACT: call the generator
		const slug = await generator.generateUniqueSlug('https://google.com')

		//3. ASSERT: check the slug
		expect(slug).toBeDefined()
		expect(slug).toHaveLength(7)
		expect(mockUrlRepository.isSlugAvailable).toHaveBeenCalledTimes(4)
	})

	it('Should throw an error if maxAttempts is exceeded for all lengths', async () => {
		//1. ARRANGE: mock that the slug is always unavailable

		mockUrlRepository = {
			isSlugAvailable: vi.fn().mockResolvedValue(false), // Always unavailable
			save: vi.fn().mockResolvedValue(undefined),
			getUrlBySlug: vi.fn().mockResolvedValue(null),
		}

		//Config for the slug generator
		const config = {
			initialLength: 6,
			maxLength: 12,
			maxAttempts: 3,
		}

		// Instantiate the slug generator
		const generator = new RandomBase62SlugGenerator(mockUrlRepository, config)

		//2. ACT: call the generator
		await expect(
			generator.generateUniqueSlug('https://google.com'),
		).rejects.toThrow('Error creating Short URL. Please try again later.')
	})
})

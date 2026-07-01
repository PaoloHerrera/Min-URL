import crypto from 'node:crypto'
import { base64ToBase62, generateHash } from '../../../utils/utils.js'
import type { SlugGenerator } from '../ports/SlugGenerator.interface.js'
import type { UrlRepository } from '../ports/UrlRepository.interface.js'

interface SlugConfig {
	maxLength: number
	maxAttempts: number
	initialLength: number
}

export class RandomBase62SlugGenerator implements SlugGenerator {
	private readonly repository: UrlRepository
	private readonly config: SlugConfig

	constructor(repository: UrlRepository, config: SlugConfig) {
		this.repository = repository
		this.config = config
	}

	private async checkAvailability(slug: string): Promise<boolean> {
		return await this.repository.isSlugAvailable(slug)
	}

	public async generateUniqueSlug(url: string): Promise<string> {
		return await this.generateUniqueSlugRecursive(
			url,
			this.config.initialLength,
		)
	}

	private async generateUniqueSlugRecursive(
		url: string,
		length: number,
	): Promise<string> {
		let attempts = 0

		while (attempts < this.config.maxAttempts) {
			const inputForSlug = `${url}-${crypto.randomUUID()}`
			const base62Hash = base64ToBase62(generateHash(inputForSlug, crypto))
			const slug = base62Hash.substring(0, length)
			// Check availability
			if (await this.checkAvailability(slug)) {
				return slug
			}

			attempts++
		}

		// If the slug is not available, retry with a longer slug
		if (length < this.config.maxLength) {
			return this.generateUniqueSlugRecursive(url, length + 1)
		}

		throw new Error('Error creating Short URL. Please try again later.')
	}
}

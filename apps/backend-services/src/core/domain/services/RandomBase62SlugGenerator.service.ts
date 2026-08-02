import type { TargetUrl } from '@/core/domain/value-objects/target-url/TargetUrl.vo.ts'
import type { ShortUrlRepositoryPort } from '@/core/ports/outbound/ShortUrlRepositoryPort.interface.ts'
import type { SlugGeneratorPort } from '@/core/ports/outbound/SlugGeneratorPort.interface.ts'
import { SlugGenerationExhaustedError } from '../errors/domain.errors.ts'
import { base64ToBase62, generateHash } from './base62.utils.ts'

interface SlugConfig {
	maxLength: number
	maxAttempts: number
	initialLength: number
}

export class RandomBase62SlugGenerator implements SlugGeneratorPort {
	private readonly repository: ShortUrlRepositoryPort
	private readonly config: SlugConfig

	constructor(repository: ShortUrlRepositoryPort, config: SlugConfig) {
		this.repository = repository
		this.config = config
	}

	private async checkAvailability(slug: string): Promise<boolean> {
		return await this.repository.isSlugAvailable(slug)
	}

	public async generateUniqueSlug(url: TargetUrl): Promise<string> {
		return await this.generateUniqueSlugRecursive(
			url,
			this.config.initialLength,
		)
	}

	private async generateUniqueSlugRecursive(
		url: TargetUrl,
		length: number,
	): Promise<string> {
		let attempts = 0

		while (attempts < this.config.maxAttempts) {
			const inputForSlug = `${url.value}-${crypto.randomUUID()}`
			const base62Hash = base64ToBase62(generateHash(inputForSlug))
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

		throw new SlugGenerationExhaustedError()
	}
}

import type { ShortUrl } from '@/core/domain/entities/ShortUrl.entity.ts'
import type { ShortUrlRepository } from '../ports/ShortUrlRepository.interface.ts'

import {
	SlugIsDeletedError,
	SlugIsExpiredError,
	SlugNotFoundError,
} from '@/core/domain/errors/domain.errors.ts'

export interface VisitShortUrlInput {
	slug: string
}

export class VisitShortUrl {
	private readonly shortUrlRepository: ShortUrlRepository

	constructor(shortUrlRepository: ShortUrlRepository) {
		this.shortUrlRepository = shortUrlRepository
	}

	async execute(input: VisitShortUrlInput): Promise<ShortUrl> {
		const { slug } = input
		const shortUrlData = await this.shortUrlRepository.getUrlBySlug(slug)

		if (!shortUrlData) {
			throw new SlugNotFoundError(slug)
		}

		if (shortUrlData.isDeleted()) {
			throw new SlugIsDeletedError(slug)
		}

		if (shortUrlData.isExpired()) {
			throw new SlugIsExpiredError(slug)
		}

		return shortUrlData
	}
}

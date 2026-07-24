import type {
	VisitShortUrlInput,
	VisitShortUrlPort,
} from '@/core/ports/inbound/VisitShortUrlPort.interface.ts'
import type { ShortUrl } from '@/core/domain/entities/ShortUrl.entity.ts'
import type { ShortUrlRepositoryPort } from '../ports/outbound/ShortUrlRepositoryPort.interface.ts'

import {
	SlugIsDeletedError,
	SlugIsExpiredError,
	SlugNotFoundError,
} from '@/core/domain/errors/domain.errors.ts'

export class VisitShortUrl implements VisitShortUrlPort {
	private readonly shortUrlRepository: ShortUrlRepositoryPort

	constructor(shortUrlRepository: ShortUrlRepositoryPort) {
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

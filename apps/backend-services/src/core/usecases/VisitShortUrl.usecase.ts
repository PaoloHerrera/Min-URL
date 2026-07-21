import type { ShortUrlRepository } from '../ports/ShortUrlRepository.interface.ts'

import {
	SlugIsDeletedError,
	SlugIsExpiredError,
	SlugNotFoundError,
} from '@/core/domain/errors/domain.errors.ts'

export interface VisitShortUrlInput {
	slug: string
}

export interface VisitShortUrlOutput {
	slug: string
	password: boolean
	originalUrl?: string
	queryAt: string
}

export class VisitShortUrl {
	private readonly shortUrlRepository: ShortUrlRepository

	constructor(shortUrlRepository: ShortUrlRepository) {
		this.shortUrlRepository = shortUrlRepository
	}

	async execute(input: VisitShortUrlInput): Promise<VisitShortUrlOutput> {
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

		const output: VisitShortUrlOutput = {
			slug: shortUrlData.slug.value,
			password: !!shortUrlData.passwordHash,
			queryAt: new Date().toISOString(),
		}

		//if password is true, don't return the originalUrl
		if (!shortUrlData.passwordHash) {
			output.originalUrl = shortUrlData.originalUrl.value
		}

		return output
	}
}

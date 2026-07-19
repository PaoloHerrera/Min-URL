import type { UrlRepository } from '../ports/UrlRepository.interface.ts'

export interface VisitShortUrlInput {
	slug: string
}

export interface VisitShortUrlOutput {
	slug: string
	password: boolean
	originalUrl?: string
	queryAt: string
}

export class VisitShortUrlUseCase {
	private readonly urlRepository: UrlRepository

	constructor(urlRepository: UrlRepository) {
		this.urlRepository = urlRepository
	}

	async execute(
		input: VisitShortUrlInput,
	): Promise<VisitShortUrlOutput | null> {
		const { slug } = input
		const urlData = await this.urlRepository.getUrlBySlug(slug)
		if (!urlData || urlData.isDeleted() || urlData.isExpired()) {
			return null
		}

		const output: VisitShortUrlOutput = {
			slug: urlData.slug.value,
			password: !!urlData.passwordHash,
			queryAt: new Date().toISOString(),
		}

		//if password is true, don't return the originalUrl
		if (!urlData.passwordHash) {
			output.originalUrl = urlData.originalUrl.value
		}

		return output
	}
}

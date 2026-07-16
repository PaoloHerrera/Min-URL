import type { UrlRepository } from '../ports/UrlRepository.interface.js'

export interface ResolveSlugRedirectInput {
	slug: string
}

export interface ResolveSlugRedirectOutput {
	slug: string
	password: boolean
	originalUrl?: string
	queryAt: string
}

export class ResolveSlugRedirectUseCase {
	private readonly urlRepository: UrlRepository

	constructor(urlRepository: UrlRepository) {
		this.urlRepository = urlRepository
	}

	async execute(
		input: ResolveSlugRedirectInput,
	): Promise<ResolveSlugRedirectOutput | null> {
		const { slug } = input
		const urlData = await this.urlRepository.getUrlBySlug(slug)
		if (!urlData || urlData.isDeleted() || urlData.isExpired()) {
			return null
		}

		const output: ResolveSlugRedirectOutput = {
			slug: urlData.slug,
			password: !!urlData.passwordHash,
			queryAt: new Date().toISOString(),
		}

		//if password is true, don't return the originalUrl
		if (!urlData.passwordHash) {
			output.originalUrl = urlData.originalUrl
		}

		return output
	}
}

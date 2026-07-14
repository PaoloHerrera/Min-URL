import type { UrlRepository } from '../ports/UrlRepository.interface.js'

interface GetUrlMetadataInput {
	slug: string
}

interface GetUrlMetadataOutput {
	slug: string
	password: boolean
	queryAt: string
	originalUrl?: string
	createdAt?: string
}

export class GetUrlMetadataUseCase {
	private readonly urlRepository: UrlRepository

	constructor(urlRepository: UrlRepository) {
		this.urlRepository = urlRepository
	}

	async execute(
		input: GetUrlMetadataInput,
	): Promise<GetUrlMetadataOutput | null> {
		const { slug } = input
		const urlData = await this.urlRepository.getUrlBySlug(slug)
		if (!urlData || urlData.deleted || urlData.expired) {
			return null
		}

		const output: GetUrlMetadataOutput = {
			slug: urlData.slug,
			password: !!urlData.password,
			queryAt: new Date().toISOString(),
		}

		//if password is true, don't return the originalUrl
		if (!urlData.password) {
			output.originalUrl = urlData.long_url
			output.createdAt = urlData.created_at?.toISOString()
		}

		return output
	}
}

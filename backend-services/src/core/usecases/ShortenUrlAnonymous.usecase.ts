import type { CaptchaServices } from '../ports/CaptchaServices.interface.js'
import type { GeolocationsServices } from '../ports/geolocationServices.interface.js'
import type { SlugGenerator } from '../ports/SlugGenerator.interface.js'
import type { UrlRepository } from '../ports/UrlRepository.interface.js'

interface ShortenUrlInput {
	originalUrl: string
	captchaToken: string
	clientIp: string
}

interface ShortenUrlOutput {
	originalUrl: string
	slug: string
	purpose: 'direct' | 'qr' | 'api'
	createdAt: Date
}

export class ShortenUrlAnonymousUseCase {
	private readonly urlRepository: UrlRepository
	private readonly captchaServices: CaptchaServices
	private readonly geolocationServices: GeolocationsServices
	private readonly slugGenerator: SlugGenerator

	constructor(
		urlRepository: UrlRepository,
		captchaServices: CaptchaServices,
		geolocationServices: GeolocationsServices,
		slugGenerator: SlugGenerator,
	) {
		this.urlRepository = urlRepository
		this.captchaServices = captchaServices
		this.geolocationServices = geolocationServices
		this.slugGenerator = slugGenerator
	}

	async execute(input: ShortenUrlInput): Promise<ShortenUrlOutput> {
		const { originalUrl, captchaToken, clientIp } = input

		//1. Verify if the user is a bot
		const isHuman = await this.captchaServices.verify(captchaToken)

		if (!isHuman) {
			throw new Error('Invalid captcha token')
		}

		//2. Get or create geolocation
		const geolocation = await this.geolocationServices.getOrCreate(clientIp)

		//3. Generate a unique slug
		const slug = await this.slugGenerator.generateUniqueSlug(originalUrl)

		//4. Save anonimous url in the repository
		const savedUrl = await this.urlRepository.createAnonymous(
			originalUrl,
			slug,
			geolocation.id_geolocations,
		)

		//5. Return the short URL
		return {
			originalUrl: savedUrl.long_url,
			slug: savedUrl.slug,
			purpose: savedUrl.purpose,
			createdAt: savedUrl.created_at,
		}
	}
}

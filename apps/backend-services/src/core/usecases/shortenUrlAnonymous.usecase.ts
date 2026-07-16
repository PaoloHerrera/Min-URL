import { ShortUrl } from '../domain/entities/ShortUrl.ts'
import type { ShortUrlProps } from '../domain/entities/ShortUrl.ts'
import type { CaptchaServices } from '../ports/CaptchaServices.interface.js'
import type { GeolocationRepository } from '../ports/GeolocationRepository.interface.js'
import type { IpResolver } from '../ports/IpResolver.interface.ts'
import type { SlugGenerator } from '../ports/SlugGenerator.interface.js'
import type { UrlRepository } from '../ports/UrlRepository.interface.js'

interface ShortenUrlAnonymousUseCaseProps {
	urlRepository: UrlRepository
	captchaServices: CaptchaServices
	geolocationRepository: GeolocationRepository
	slugGenerator: SlugGenerator
	ipResolver: IpResolver
}

interface ShortenUrlInput {
	originalUrl: string
	captchaToken: string
	clientIp: string
}

interface ShortenUrlOutput {
	originalUrl: string
	slug: string
	createdAt: Date
}

export class ShortenUrlAnonymousUseCase {
	private readonly props: ShortenUrlAnonymousUseCaseProps

	constructor(props: ShortenUrlAnonymousUseCaseProps) {
		this.props = props
	}

	async execute(input: ShortenUrlInput): Promise<ShortenUrlOutput> {
		const { originalUrl, captchaToken, clientIp } = input

		//1. Verify if the user is a bot
		const isHuman = await this.props.captchaServices.verify(captchaToken)

		if (!isHuman) {
			throw new Error('Invalid captcha token')
		}

		//2. Get or create geolocation
		let geolocation = await this.props.geolocationRepository.getByIp(clientIp)
		if (!geolocation) {
			geolocation = this.props.ipResolver.resolve(clientIp)
			await this.props.geolocationRepository.save(geolocation)
		}

		//3. Generate a unique slug
		const slug = await this.props.slugGenerator.generateUniqueSlug(originalUrl)

		//4. Save anonimous url in the repository
		const dataToSave: ShortUrlProps = {
			slug: slug,
			originalUrl: originalUrl,
			title: 'Anonymous link',
			purpose: 'direct',
			passwordHash: null,
			expiredAt: null,
			geolocation: geolocation,
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		const url = ShortUrl.create(dataToSave)
		await this.props.urlRepository.save(url)

		//5. Return the short URL
		return {
			originalUrl: url.originalUrl,
			slug: url.slug,
			createdAt: url.createdAt,
		}
	}
}

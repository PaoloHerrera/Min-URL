import { ShortUrl } from '../domain/entities/ShortUrl.entity.ts'
import type { CreateShortUrlInput } from '../domain/entities/ShortUrl.entity.ts'
import {
	CaptchaVerificationError,
	ForbiddenExtensionError,
} from '../domain/errors/domain.errors.ts'
import { IpAddress } from '../domain/value-objects/ip-address/IpAddress.vo.ts'
import { Slug } from '../domain/value-objects/slug/Slug.vo.ts'
import { TargetUrl } from '../domain/value-objects/target-url/TargetUrl.vo.ts'
import type { CaptchaServices } from '../ports/CaptchaServices.interface.ts'
import type { ForbiddenExtensions } from '../ports/ForbiddenExtensions.interface.ts'
import type { IpGeolocationResolver } from '../ports/IpGeolocationResolver.interface.ts'
import type { ShortUrlRepository } from '../ports/ShortUrlRepository.interface.ts'
import type { SlugGenerator } from '../ports/SlugGenerator.interface.ts'

interface ShortenUrlAnonymousProps {
	shortUrlRepository: ShortUrlRepository
	captchaServices: CaptchaServices
	slugGenerator: SlugGenerator
	forbiddenExtensions: ForbiddenExtensions
	ipGeolocationResolver: IpGeolocationResolver
}

interface ShortenUrlAnonymousInput {
	originalUrl: string
	captchaToken: string
	clientIp: string
}

export class ShortenUrlAnonymous {
	private readonly props: ShortenUrlAnonymousProps

	constructor(props: ShortenUrlAnonymousProps) {
		this.props = props
	}

	async execute(input: ShortenUrlAnonymousInput): Promise<ShortUrl> {
		const { originalUrl, captchaToken, clientIp } = input

		//1. Verify if the user is a bot
		const isHuman = await this.props.captchaServices.verify(captchaToken)

		if (!isHuman) {
			throw new CaptchaVerificationError()
		}

		//3. Create a targetUrl value object
		const targetUrl = TargetUrl.create(originalUrl)

		//3.1 Verify if the URL contains forbidden extensions
		if (this.props.forbiddenExtensions.check(targetUrl)) {
			throw new ForbiddenExtensionError(originalUrl)
		}

		//4. Generate a unique slug
		const slug = await this.props.slugGenerator.generateUniqueSlug(targetUrl)

		//5. Create a ipAddress value object
		const baseIpAddress = IpAddress.createOrUnknown(clientIp)
		const geolocation = this.props.ipGeolocationResolver.resolve(baseIpAddress)
		const ipAddress = baseIpAddress.withGeolocation(geolocation)

		//6. Save anonimous url in the repository
		const dataToSave: CreateShortUrlInput = {
			slug: Slug.create(slug),
			originalUrl: targetUrl,
			title: 'Anonymous link',
			ipAddress: ipAddress,
			purpose: 'direct',
			passwordHash: null,
		}

		const shorturl = ShortUrl.create(dataToSave)
		await this.props.shortUrlRepository.save(shorturl)

		//7. Return the short URL
		return shorturl
	}
}

import {
	CaptchaVerificationError,
	ForbiddenExtensionError,
} from '../domain/errors/domain.errors.ts'
import { ShortUrl } from '../domain/entities/ShortUrl.entity.ts'
import type { CreateShortUrlInput } from '../domain/entities/ShortUrl.entity.ts'
import { TargetUrl } from '../domain/value-objects/target-url/TargetUrl.vo.ts'
import type { CaptchaServices } from '../ports/CaptchaServices.interface.ts'
import type { SlugGenerator } from '../ports/SlugGenerator.interface.ts'
import type { UrlRepository } from '../ports/UrlRepository.interface.ts'

import type { ForbiddenExtensions } from '../ports/ForbiddenExtensions.interface.ts'

import { IpAddress } from '../domain/value-objects/ip-address/IpAddress.vo.ts'
import { Slug } from '../domain/value-objects/slug/Slug.vo.ts'

interface ShortenUrlAnonymousUseCaseProps {
	urlRepository: UrlRepository
	captchaServices: CaptchaServices
	slugGenerator: SlugGenerator
	forbiddenExtensions: ForbiddenExtensions
}

interface ShortenUrlInput {
	originalUrl: string
	captchaToken: string
	clientIp: string
}

export class ShortenUrlAnonymousUseCase {
	private readonly props: ShortenUrlAnonymousUseCaseProps

	constructor(props: ShortenUrlAnonymousUseCaseProps) {
		this.props = props
	}

	async execute(input: ShortenUrlInput): Promise<ShortUrl> {
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

		//5. Save anonimous url in the repository
		const dataToSave: CreateShortUrlInput = {
			slug: Slug.create(slug),
			originalUrl: targetUrl,
			title: 'Anonymous link',
			ipAddress: IpAddress.createOrUnknown(clientIp),
			purpose: 'direct',
			passwordHash: null,
		}

		const url = ShortUrl.create(dataToSave)
		await this.props.urlRepository.save(url)

		//6. Return the short URL
		return url
	}
}

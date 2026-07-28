import type {
	ShortenUrlAnonymousInput,
	ShortenUrlAnonymousPort,
} from '@/core/ports/inbound/ShortenUrlAnonymousPort.interface.ts'
import { ShortUrl } from '../domain/entities/ShortUrl.entity.ts'
import type { CreateShortUrlInput } from '../domain/entities/ShortUrl.entity.ts'
import {
	CaptchaVerificationError,
	ForbiddenExtensionError,
} from '../domain/errors/domain.errors.ts'
import { IpAddress } from '../domain/value-objects/ip-address/IpAddress.vo.ts'
import { Slug } from '../domain/value-objects/slug/Slug.vo.ts'
import { TargetUrl } from '../domain/value-objects/target-url/TargetUrl.vo.ts'
import type { CaptchaServicePort } from '../ports/outbound/CaptchaServicePort.interface.ts'
import type { ForbiddenExtensionsPort } from '../ports/outbound/ForbiddenExtensionsPort.interface.ts'
import type { IpGeolocationResolverPort } from '../ports/outbound/IpGeolocationResolverPort.interface.ts'
import type { ShortUrlRepositoryPort } from '../ports/outbound/ShortUrlRepositoryPort.interface.ts'
import type { SlugGeneratorPort } from '../ports/outbound/SlugGeneratorPort.interface.ts'

interface ShortenUrlAnonymousProps {
	shortUrlRepository: ShortUrlRepositoryPort
	captchaServices: CaptchaServicePort
	slugGenerator: SlugGeneratorPort
	forbiddenExtensions: ForbiddenExtensionsPort
	ipGeolocationResolver: IpGeolocationResolverPort
}

export class ShortenUrlAnonymous implements ShortenUrlAnonymousPort {
	private readonly props: ShortenUrlAnonymousProps

	constructor(props: ShortenUrlAnonymousProps) {
		this.props = props
	}

	async execute(input: ShortenUrlAnonymousInput): Promise<ShortUrl> {
		const { originalUrl, captchaToken, clientIp } = input

		const isCaptchaValid = await this.props.captchaServices.verify(captchaToken)
		if (!isCaptchaValid) {
			throw new CaptchaVerificationError()
		}

		const targetUrlVo = TargetUrl.create(originalUrl)

		const isForbidden = this.props.forbiddenExtensions.check(targetUrlVo)
		if (isForbidden) {
			throw new ForbiddenExtensionError(targetUrlVo.value)
		}

		const generatedSlug =
			await this.props.slugGenerator.generateUniqueSlug(targetUrlVo)
		const slugVo = Slug.create(generatedSlug)

		const initialIpVo = IpAddress.createOrUnknown(clientIp)
		const userLocation =
			await this.props.ipGeolocationResolver.resolve(initialIpVo)
		const ipAddressVo = IpAddress.createOrUnknown(clientIp, userLocation)

		const createShortUrlInput: CreateShortUrlInput = {
			originalUrl: targetUrlVo,
			slug: slugVo,
			ipAddress: ipAddressVo,
			purpose: 'direct',
			title: 'Untitled',
		}

		const shortUrlEntity = ShortUrl.create(createShortUrlInput)
		await this.props.shortUrlRepository.save(shortUrlEntity)

		return shortUrlEntity
	}
}

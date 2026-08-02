import type {
	ShortenUrlAnonymousInput,
	ShortenUrlAnonymousPort,
} from '@/core/ports/inbound/ShortenUrlAnonymousPort.interface.ts'
import { ShortUrl } from '../domain/entities/ShortUrl.entity.ts'
import type { CreateShortUrlInput } from '../domain/entities/ShortUrl.entity.ts'
import {
	CaptchaVerificationError,
	ForbiddenExtensionError,
	SlugAlreadyExistsError,
	SlugGenerationExhaustedError,
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
		await this.ensureValidCaptcha(input.captchaToken)
		const targetUrlVo = this.ensureAllowedTargetUrl(input.originalUrl)
		const ipAddressVo = await this.resolveIpAddress(input.clientIp)

		return await this.createAndSaveWithSlugRetry(targetUrlVo, ipAddressVo)
	}

	private async ensureValidCaptcha(captchaToken: string): Promise<void> {
		const isCaptchaValid = await this.props.captchaServices.verify(captchaToken)
		if (!isCaptchaValid) {
			throw new CaptchaVerificationError()
		}
	}

	private ensureAllowedTargetUrl(originalUrl: string): TargetUrl {
		const targetUrlVo = TargetUrl.create(originalUrl)
		const isForbidden = this.props.forbiddenExtensions.check(targetUrlVo)
		if (isForbidden) {
			throw new ForbiddenExtensionError(targetUrlVo.value)
		}
		return targetUrlVo
	}

	private async resolveIpAddress(clientIp?: string): Promise<IpAddress> {
		const initialIpVo = IpAddress.createOrUnknown(clientIp ?? '')
		const userLocation =
			await this.props.ipGeolocationResolver.resolve(initialIpVo)
		return IpAddress.createOrUnknown(clientIp ?? '', userLocation)
	}

	private async createAndSaveWithSlugRetry(
		targetUrlVo: TargetUrl,
		ipAddressVo: IpAddress,
	): Promise<ShortUrl> {
		let attempts = 0
		const MAX_ATTEMPTS = 3

		while (attempts < MAX_ATTEMPTS) {
			try {
				const generatedSlug =
					await this.props.slugGenerator.generateUniqueSlug(targetUrlVo)
				const slugVo = Slug.create(generatedSlug)

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
			} catch (error) {
				if (
					error instanceof SlugAlreadyExistsError &&
					attempts < MAX_ATTEMPTS - 1
				) {
					attempts++
					continue
				}
				throw error
			}
		}

		throw new SlugGenerationExhaustedError()
	}
}

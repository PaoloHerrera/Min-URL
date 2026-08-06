import type {
	ShortenUrlAnonymousInput,
	ShortenUrlAnonymousPort,
} from '@/core/ports/inbound/ShortenUrlAnonymousPort.interface.ts'
import { ShortUrl } from '../domain/entities/ShortUrl.entity.ts'
import type { CreateShortUrlInput } from '../domain/entities/ShortUrl.entity.ts'
import {
	ForbiddenExtensionError,
	SlugAlreadyExistsError,
} from '../domain/errors/domain.errors.ts'
import { IpAddress } from '../domain/value-objects/ip-address/IpAddress.vo.ts'
import { Slug } from '../domain/value-objects/slug/Slug.vo.ts'
import { TargetUrl } from '../domain/value-objects/target-url/TargetUrl.vo.ts'
import type { ForbiddenExtensionsPort } from '../ports/outbound/ForbiddenExtensionsPort.interface.ts'
import type { IpGeolocationResolverPort } from '../ports/outbound/IpGeolocationResolverPort.interface.ts'
import type { ShortUrlRepositoryPort } from '../ports/outbound/ShortUrlRepositoryPort.interface.ts'
import type { SlugGeneratorPort } from '../ports/outbound/SlugGeneratorPort.interface.ts'

interface ShortenUrlAnonymousProps {
	shortUrlRepository: ShortUrlRepositoryPort
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
		const targetUrlVo = this.ensureAllowedTargetUrl(input.originalUrl)
		const ipAddressVo = await this.resolveIpAddress(input.clientIp)

		return await this.createAndSaveWithSlugRetry(targetUrlVo, ipAddressVo)
	}

	private ensureAllowedTargetUrl(originalUrl: string): TargetUrl {
		const targetUrlVo = TargetUrl.create(originalUrl)
		const isForbidden = this.props.forbiddenExtensions.check(targetUrlVo)
		if (isForbidden) {
			throw new ForbiddenExtensionError()
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
		const MAX_ATTEMPTS = 3
		let lastError: unknown

		for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
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
				if (!(error instanceof SlugAlreadyExistsError)) {
					throw error
				}
				lastError = error
			}
		}

		throw lastError
	}
}

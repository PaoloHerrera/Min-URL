import type {
	VisitShortUrlInput,
	VisitShortUrlPort,
} from '@/core/ports/inbound/VisitShortUrlPort.interface.ts'
import type { ShortUrl } from '@/core/domain/entities/ShortUrl.entity.ts'
import { Visit } from '@/core/domain/entities/Visit.entity.ts'
import { IpAddress } from '@/core/domain/value-objects/ip-address/IpAddress.vo.ts'
import { Referer } from '@/core/domain/value-objects/referer/Referer.vo.ts'
import { UserAgent } from '@/core/domain/value-objects/user-agent/UserAgent.vo.ts'
import type { ShortUrlRepositoryPort } from '../ports/outbound/ShortUrlRepositoryPort.interface.ts'
import type { VisitRepositoryPort } from '../ports/outbound/VisitRepositoryPort.interface.ts'

import {
	SlugIsDeletedError,
	SlugIsExpiredError,
	SlugNotFoundError,
} from '@/core/domain/errors/domain.errors.ts'

export class VisitShortUrl implements VisitShortUrlPort {
	private readonly shortUrlRepository: ShortUrlRepositoryPort
	private readonly visitRepository: VisitRepositoryPort

	constructor(
		shortUrlRepository: ShortUrlRepositoryPort,
		visitRepository: VisitRepositoryPort,
	) {
		this.shortUrlRepository = shortUrlRepository
		this.visitRepository = visitRepository
	}

	async execute(input: VisitShortUrlInput): Promise<ShortUrl> {
		const { slug, ipAddress, userAgent, referer } = input
		const shortUrlData = await this.shortUrlRepository.getUrlBySlug(slug)

		if (!shortUrlData) {
			throw new SlugNotFoundError(slug)
		}

		if (shortUrlData.isDeleted()) {
			throw new SlugIsDeletedError(slug)
		}

		if (shortUrlData.isExpired()) {
			throw new SlugIsExpiredError(slug)
		}

		const visit = Visit.create({
			shortUrlId: shortUrlData.id,
			ipAddress: IpAddress.createOrUnknown(ipAddress ?? 'unknown'),
			userAgent: UserAgent.create(userAgent),
			referer: Referer.create(referer),
		})

		// Record analytics visit event — atomic clicks_count increment is
		// handled inside visitRepository.save() via a DB transaction.
		await this.visitRepository.save(visit)

		return shortUrlData
	}
}

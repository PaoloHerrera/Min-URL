import { shortUrls } from '@/adapters/secondary/db/schema/short-urls.schema.ts'
import { visits } from '@/adapters/secondary/db/schema/visits.schema.ts'
import type { Db } from '@/adapters/secondary/db/connection.ts'
import type { Visit } from '@/core/domain/entities/Visit.entity.ts'
import type { VisitRepositoryPort } from '@/core/ports/outbound/VisitRepositoryPort.interface.ts'
import { eq, sql } from 'drizzle-orm'

export class DrizzleVisitRepository implements VisitRepositoryPort {
	private readonly db: Db

	constructor(db: Db) {
		this.db = db
	}

	async save(visit: Visit): Promise<void> {
		await this.db.transaction(async (tx) => {
			await tx.insert(visits).values({
				id: visit.id,
				shortUrlId: visit.shortUrlId,
				ipAddress: visit.ipAddress.ipAddress,
				userAgent: visit.userAgent.value,
				referer: visit.referer.value,
				refererDomain: visit.referer.domain,
				browser: visit.userAgent.browser,
				os: visit.userAgent.os,
				device: visit.userAgent.device,
				geolocation: visit.ipAddress.geolocation
					? {
							country: visit.ipAddress.geolocation.country,
							region: visit.ipAddress.geolocation.region,
							city: visit.ipAddress.geolocation.city,
							latitude: visit.ipAddress.geolocation.latitude,
							longitude: visit.ipAddress.geolocation.longitude,
							timezone: visit.ipAddress.geolocation.timezone,
						}
					: null,
				visitedAt: visit.visitedAt,
			})

			await tx
				.update(shortUrls)
				.set({
					clicksCount: sql`${shortUrls.clicksCount} + 1`,
				})
				.where(eq(shortUrls.id, visit.shortUrlId))
		})
	}
}

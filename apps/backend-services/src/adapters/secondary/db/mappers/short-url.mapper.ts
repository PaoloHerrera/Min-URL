import type { shortUrls } from '@/adapters/secondary/db/schema/short-urls.schema.ts'
import { ShortUrl } from '@/core/domain/entities/ShortUrl.entity.ts'
import { Geolocation } from '@/core/domain/value-objects/geolocation/Geolocation.vo.ts'
import type { GeolocationProps } from '@/core/domain/value-objects/geolocation/Geolocation.vo.ts'
import { IpAddress } from '@/core/domain/value-objects/ip-address/IpAddress.vo.ts'
import { Password } from '@/core/domain/value-objects/password/Password.vo.ts'
import { Slug } from '@/core/domain/value-objects/slug/Slug.vo.ts'
import { TargetUrl } from '@/core/domain/value-objects/target-url/TargetUrl.vo.ts'

type ShortUrlRow = typeof shortUrls.$inferSelect
type ShortUrlInsert = typeof shortUrls.$inferInsert

export const toDomain = (row: ShortUrlRow): ShortUrl => {
	return ShortUrl.reconstitute({
		id: row.id,
		slug: Slug.reconstitute(row.slug),
		originalUrl: TargetUrl.reconstitute(row.originalUrl),
		title: row.title,
		purpose: row.purpose,
		clicksCount: row.clicksCount,
		ipAddress: IpAddress.reconstitute({
			ipAddress: row.ipAddress,
			geolocation: row.geolocation
				? Geolocation.reconstitute(row.geolocation as GeolocationProps)
				: null,
		}),
		passwordHash: row.passwordHash
			? Password.reconstitute(row.passwordHash)
			: null,
		expirationDate: row.expirationDate,
		expiredAt: row.expiredAt,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
		deletedAt: row.deletedAt,
	})
}

export const toPersistence = (entity: ShortUrl): ShortUrlInsert => {
	return {
		id: entity.id,
		slug: entity.slug.value,
		originalUrl: entity.originalUrl.value,
		title: entity.title,
		purpose: entity.purpose,
		clicksCount: entity.clicksCount,
		ipAddress: entity.ipAddress.ipAddress,
		geolocation: entity.ipAddress.geolocation
			? {
					country: entity.ipAddress.geolocation.country,
					region: entity.ipAddress.geolocation.region,
					city: entity.ipAddress.geolocation.city,
					latitude: entity.ipAddress.geolocation.latitude,
					longitude: entity.ipAddress.geolocation.longitude,
					timezone: entity.ipAddress.geolocation.timezone,
				}
			: null,
		passwordHash: entity.passwordHash?.hash ?? null,
		expirationDate: entity.expirationDate,
		expiredAt: entity.expiredAt,
		createdAt: entity.createdAt ?? new Date(),
		updatedAt: entity.updatedAt ?? new Date(),
		deletedAt: entity.deletedAt,
	}
}

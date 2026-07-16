import { sequelize } from '../../../../config/database.js'
import { ShortUrl } from '../../../core/domain/entities/ShortUrl.ts'
import type { UrlRepository } from '../../../core/ports/UrlRepository.interface.js'
import { GeolocationModel } from './models/Geolocation.model.ts'
import { SlugModel } from './models/Slug.model.js'
import { UrlModel } from './models/Url.model.js'

export class SequelizeUrlRepository implements UrlRepository {
	async isSlugAvailable(slug: string): Promise<boolean> {
		const exists = await SlugModel.findOne({ where: { slug } })
		return !exists
	}
	async save(shortUrl: ShortUrl) {
		const transaction = await sequelize.transaction()

		try {
			// 1. Verify geolocation exists

			if (!shortUrl.geolocation) {
				throw new Error(`Geolocation is null for slug: ${shortUrl.slug}`)
			}

			const geoRecord = await GeolocationModel.findOne({
				where: { ip_address: shortUrl.geolocation.ipAddress },
			})
			if (!geoRecord) {
				throw new Error(
					`Geolocation not found with ip address ${shortUrl.geolocation.ipAddress}`,
				)
			}

			const geoId = geoRecord.id_geolocations
			const urlRecord = await UrlModel.create(
				{
					long_url: shortUrl.originalUrl,
					geolocations_id: geoId,
					title: shortUrl.title,
					purpose: shortUrl.purpose,
					password_hash: shortUrl.passwordHash,
					expiration_date: shortUrl.expirationDate,
					expired_at: shortUrl.expiredAt,
					deleted_at: shortUrl.deletedAt,
				},
				{ transaction },
			)

			await SlugModel.create(
				{
					url_id: urlRecord.id_urls,
					slug: shortUrl.slug,
				},
				{ transaction },
			)
			await transaction.commit()
		} catch (error) {
			await transaction.rollback()
			throw new Error(
				`Database error creating anonymous short url: ${(error as Error).message}`,
			)
		}
	}

	async getUrlBySlug(slug: string): Promise<ShortUrl | null> {
		UrlModel.hasMany(SlugModel, { foreignKey: 'url_id' })
		SlugModel.belongsTo(UrlModel, { foreignKey: 'url_id' })

		const urlRecord = await UrlModel.findOne({
			include: [
				{
					model: SlugModel,
					where: { slug },
					attributes: ['slug'],
				},
			],
		})

		if (!urlRecord) {
			return null
		}

		return ShortUrl.create({
			slug: slug,
			title: urlRecord.title,
			originalUrl: urlRecord.long_url,
			purpose: urlRecord.purpose,
			passwordHash: urlRecord.password_hash,
			expirationDate: urlRecord.expiration_date,
			expiredAt: urlRecord.expired_at,
			createdAt: urlRecord.created_at,
			updatedAt: urlRecord.updated_at,
			deletedAt: urlRecord.deleted_at,
		})
	}
}

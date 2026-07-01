import { sequelize } from '../../../../config/database.js'
import type {
	Url,
	UrlRepository,
} from '../../../core/ports/UrlRepository.interface.js'
import { SlugModel } from './models/Slug.model.js'
import { UrlModel } from './models/Url.model.js'

export class SequelizeUrlRepository implements UrlRepository {
	async isSlugAvailable(slug: string): Promise<boolean> {
		const exists = await SlugModel.findOne({ where: { slug } })
		return !exists
	}
	async createAnonymous(
		originalUrl: string,
		slug: string,
		geoId: string,
	): Promise<Url> {
		const transaction = await sequelize.transaction()

		try {
			const urlRecord = await UrlModel.create(
				{
					long_url: originalUrl,
					geolocations_id: geoId,
					title: 'Anonymous link',
					purpose: 'direct',
				},
				{ transaction },
			)

			const shortUrlRecord = await SlugModel.create(
				{
					url_id: urlRecord.id_urls,
					slug: slug,
				},
				{ transaction },
			)
			await transaction.commit()

			return {
				id_urls: urlRecord.id_urls,
				long_url: urlRecord.long_url,
				purpose: urlRecord.purpose,
				slug: shortUrlRecord.slug,
				created_at: urlRecord.created_at,
			}
		} catch (error) {
			await transaction.rollback()
			throw new Error(
				`Database error creating anonymous short url: ${(error as Error).message}`,
			)
		}
	}
}

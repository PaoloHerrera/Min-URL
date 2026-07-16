import { Geolocation } from '../../../core/domain/value-objects/Geolocation.ts'
import type { GeolocationRepository } from '../../../core/ports/GeolocationRepository.interface.ts'
import { GeolocationModel } from './models/Geolocation.model.ts'

export class SequelizeGeolocationService implements GeolocationRepository {
	async getByIp(ipAddress: string): Promise<Geolocation | null> {
		const geolocation = await GeolocationModel.findOne({
			where: { ip_address: ipAddress },
		})
		if (!geolocation) {
			return null
		}

		return Geolocation.create({
			ipAddress: geolocation.ip_address,
			country: geolocation.country,
			region: geolocation.region,
			timezone: geolocation.timezone,
			city: geolocation.city,
			latitude: geolocation.latitude,
			longitude: geolocation.longitude,
			createdAt: geolocation.created_at,
			updatedAt: geolocation.created_at,
		})
	}

	async save(geolocation: Geolocation): Promise<void> {
		await GeolocationModel.create({
			ip_address: geolocation.ipAddress,
			country: geolocation.country,
			region: geolocation.region,
			timezone: geolocation.timezone,
			city: geolocation.city,
			latitude: geolocation.latitude,
			longitude: geolocation.longitude,
			created_at: geolocation.createdAt,
			updated_at: geolocation.updatedAt,
		})
	}
}

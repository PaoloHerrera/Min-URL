import geoipCountry from 'geoip-country'
import geoip from 'geoip-lite'
import type { GeolocationsServices } from '../../../core/ports/GeolocationServices.interface.js'
import { GeolocationModel } from './models/Geolocation.model.js'

interface GeoId {
	id_geolocations: string
}

export class SequelizeGeolocationService implements GeolocationsServices {
	async getOrCreate(ipAddress: string): Promise<GeoId> {
		//1. Check if geolocation exists
		try {
			const geolocation = await GeolocationModel.findOne({
				where: { ip_address: ipAddress },
			})
			if (geolocation) {
				return {
					id_geolocations: geolocation.id_geolocations,
				}
			}
		} catch (error) {
			throw new Error(
				`Database error getting geolocation: ${(error as Error).message}`,
			)
		}

		//2. If not exists, create new geolocation
		const geo = geoip.lookup(ipAddress)

		const geoCountry = geoipCountry.lookup(ipAddress)

		try {
			const geolocation = await GeolocationModel.create({
				ip_address: ipAddress,
				country: geoCountry?.name || 'unknown',
				region: geo?.region || 'unknown',
				timezone: geo?.timezone || null,
				city: geo?.city || 'unknown',
				latitude: geo?.ll?.[0] ?? null,
				longitude: geo?.ll?.[1] ?? null,
			})
			return {
				id_geolocations: geolocation.id_geolocations,
			}
		} catch (error) {
			throw new Error(
				`Database error creating geolocation: ${(error as Error).message}`,
			)
		}
	}
}

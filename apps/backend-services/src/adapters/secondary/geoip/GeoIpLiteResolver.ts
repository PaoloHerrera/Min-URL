import geoipCountry from 'geoip-country'
import geoip from 'geoip-lite'
import { Geolocation } from '../../../core/domain/value-objects/Geolocation.ts'
import type { IpResolver } from '../../../core/ports/IpResolver.interface.ts'

export class GeoIpLiteResolver implements IpResolver {
	public resolve(ipAddress: string): Geolocation {
		const geo = geoip.lookup(ipAddress)

		const geoCountry = geoipCountry.lookup(ipAddress)

		return Geolocation.create({
			ipAddress: ipAddress,
			country: geoCountry?.name || geo?.country || 'unknown',
			region: geo?.region || 'unknown',
			timezone: geo?.timezone || null,
			city: geo?.city || 'unknown',
			latitude: geo?.ll?.[0] ?? null,
			longitude: geo?.ll?.[1] ?? null,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
	}

	public createUnknownGeolocation(): Geolocation {
		return Geolocation.create({
			ipAddress: 'unknown',
			country: 'unknown',
			region: 'unknown',
			timezone: null,
			city: 'unknown',
			latitude: null,
			longitude: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
	}
}

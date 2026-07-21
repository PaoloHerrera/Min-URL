import { Geolocation } from '@/core/domain/value-objects/geolocation/Geolocation.vo.ts'
import type { IpAddress } from '@/core/domain/value-objects/ip-address/IpAddress.vo.ts'
import type { IpGeolocationResolver } from '@/core/ports/IpGeolocationResolver.interface.ts'
import geoipCountry from 'geoip-country'
import geoip from 'geoip-lite'

export class GeoIpLiteResolver implements IpGeolocationResolver {
	public resolve(ipAddress: IpAddress): Geolocation {
		const geo = geoip.lookup(ipAddress.ipAddress)

		const geoCountry = geoipCountry.lookup(ipAddress.ipAddress)

		return Geolocation.create({
			country: geoCountry?.name || geo?.country || 'unknown',
			region: geo?.region || 'unknown',
			timezone: geo?.timezone || null,
			city: geo?.city || 'unknown',
			latitude: geo?.ll?.[0] ?? null,
			longitude: geo?.ll?.[1] ?? null,
		})
	}

	public createUnknownGeolocation(): Geolocation {
		return Geolocation.create({
			country: 'unknown',
			region: 'unknown',
			timezone: null,
			city: 'unknown',
			latitude: null,
			longitude: null,
		})
	}
}

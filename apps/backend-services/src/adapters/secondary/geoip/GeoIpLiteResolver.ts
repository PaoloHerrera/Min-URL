import { Geolocation } from '@/core/domain/value-objects/geolocation/Geolocation.vo.ts'
import type { IpAddress } from '@/core/domain/value-objects/ip-address/IpAddress.vo.ts'
import type { IpGeolocationResolverPort } from '@/core/ports/outbound/IpGeolocationResolverPort.interface.ts'
import geoip from 'geoip-lite'

export class GeoIpLiteResolver implements IpGeolocationResolverPort {
	public resolve(ipAddress: IpAddress): Promise<Geolocation | null> {
		const geo = geoip.lookup(ipAddress.ipAddress)

		if (!geo) {
			return Promise.resolve(Geolocation.createUnknown())
		}

		return Promise.resolve(
			Geolocation.create({
				country: geo.country || 'unknown',
				region: geo.region || 'unknown',
				timezone: geo.timezone || null,
				city: geo.city || 'unknown',
				latitude: geo.ll?.[0] ?? null,
				longitude: geo.ll?.[1] ?? null,
			}),
		)
	}
}

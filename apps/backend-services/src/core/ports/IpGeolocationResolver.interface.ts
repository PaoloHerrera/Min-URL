import type { Geolocation } from '../domain/value-objects/geolocation/Geolocation.vo.ts'
import type { IpAddress } from '../domain/value-objects/ip-address/IpAddress.vo.ts'

export interface IpGeolocationResolver {
	resolve(ipAddress: IpAddress): Geolocation
}

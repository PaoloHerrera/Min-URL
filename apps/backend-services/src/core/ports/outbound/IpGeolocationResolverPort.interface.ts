import type { Geolocation } from '@/core/domain/value-objects/geolocation/Geolocation.vo.ts'
import type { IpAddress } from '@/core/domain/value-objects/ip-address/IpAddress.vo.ts'

export interface IpGeolocationResolverPort {
	resolve(ip: IpAddress): Promise<Geolocation | null>
}

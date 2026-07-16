import type { Geolocation } from '../domain/value-objects/Geolocation.ts'

export interface IpResolver {
	resolve(ipAddress: string): Geolocation
}

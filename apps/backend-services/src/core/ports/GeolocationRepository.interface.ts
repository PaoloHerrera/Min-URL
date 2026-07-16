import type { Geolocation } from '../domain/value-objects/Geolocation.ts'

export interface GeolocationRepository {
	getByIp(ip: string): Promise<Geolocation | null>
	save(geolocation: Geolocation): Promise<void>
}

import { describe, it, expect } from 'vitest'
import { Geolocation } from '@/core/domain/value-objects/geolocation/Geolocation.vo.ts'
import { InvalidGeolocationError } from '@/core/domain/errors/domain.errors.ts'

describe('Geolocation Value Object (Unit Test)', () => {
	it('Should successfully create Geolocation for a valid geolocation', () => {
		const geolocation = Geolocation.create({
			country: 'Colombia',
			region: 'Bogota',
			timezone: 'America/Bogota',
			city: 'Bogota',
			latitude: 4.711,
			longitude: -74.0721,
		})
		expect(geolocation.country).toBe('Colombia')
		expect(geolocation.region).toBe('Bogota')
		expect(geolocation.timezone).toBe('America/Bogota')
		expect(geolocation.city).toBe('Bogota')
		expect(geolocation.latitude).toBe(4.711)
		expect(geolocation.longitude).toBe(-74.0721)
	})

	it('Should throw error for latitude out of range', () => {
		expect(() =>
			Geolocation.create({
				country: 'invalid geolocation',
				region: 'invalid geolocation',
				timezone: 'invalid geolocation',
				city: 'invalid geolocation',
				latitude: 99999999999,
				longitude: -80.1918,
			}),
		).toThrow(InvalidGeolocationError)
	})

	it('Should throw error for longitude out of range', () => {
		expect(() =>
			Geolocation.create({
				country: 'invalid geolocation',
				region: 'invalid geolocation',
				timezone: 'invalid geolocation',
				city: 'invalid geolocation',
				latitude: 4.711,
				longitude: -1000000,
			}),
		).toThrow(InvalidGeolocationError)
	})

	it('Should create unknown Geolocation object via createUnknown() factory', () => {
		const geo = Geolocation.createUnknown()
		expect(geo.country).toBe('unknown')
		expect(geo.region).toBe('unknown')
		expect(geo.city).toBe('unknown')
		expect(geo.timezone).toBeNull()
		expect(geo.latitude).toBeNull()
		expect(geo.longitude).toBeNull()
	})
})

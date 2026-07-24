import { InvalidGeolocationError } from '../../errors/domain.errors.ts'

export interface GeolocationProps {
	country?: string | null
	region?: string | null
	city?: string | null
	latitude?: number | null
	longitude?: number | null
	timezone?: string | null
}

export class Geolocation {
	private props: Readonly<Required<GeolocationProps>>

	private constructor(props: Readonly<GeolocationProps>) {
		this.props = {
			country: props.country ?? null,
			region: props.region ?? null,
			city: props.city ?? null,
			latitude: props.latitude ?? null,
			longitude: props.longitude ?? null,
			timezone: props.timezone ?? null,
		}
	}

	// Getters
	get country(): string | null {
		return this.props.country
	}

	get region(): string | null {
		return this.props.region
	}

	get city(): string | null {
		return this.props.city
	}

	get latitude(): number | null {
		return this.props.latitude
	}

	get longitude(): number | null {
		return this.props.longitude
	}

	get timezone(): string | null {
		return this.props.timezone
	}

	// Methods
	public static create(props: GeolocationProps): Geolocation {
		const geolocation = new Geolocation(props)
		geolocation.validate()
		return geolocation
	}

	public static createUnknown(): Geolocation {
		return new Geolocation({
			country: 'unknown',
			region: 'unknown',
			timezone: null,
			city: 'unknown',
			latitude: null,
			longitude: null,
		})
	}

	/**
	 * Restores a Geolocation from props already stored in the DB.
	 * Bypasses lat/lng validation — assumes the stored data is already valid.
	 */
	public static reconstitute(props: GeolocationProps): Geolocation {
		return new Geolocation(props)
	}

	private validate(): void {
		const hasLat = this.props.latitude !== null
		const hasLng = this.props.longitude !== null
		const latitude = this.props.latitude ?? 0
		const longitude = this.props.longitude ?? 0

		// Invariant
		if (hasLat !== hasLng) {
			throw new InvalidGeolocationError(
				'Latitude and Longitude must both be provided together or both be empty.',
			)
		}

		if (hasLat && (latitude < -90 || latitude > 90)) {
			throw new InvalidGeolocationError('Invalid latitude')
		}

		if (hasLng && (longitude < -180 || longitude > 180)) {
			throw new InvalidGeolocationError('Invalid longitude')
		}
	}
}

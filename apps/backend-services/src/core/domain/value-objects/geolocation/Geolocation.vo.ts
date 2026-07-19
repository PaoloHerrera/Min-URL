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
	private readonly props: Readonly<GeolocationProps>

	private constructor(props: GeolocationProps) {
		this.props = props
	}

	// Getters
	get country(): string | null | undefined {
		return this.props.country
	}

	get region(): string | null | undefined {
		return this.props.region
	}

	get city(): string | null | undefined {
		return this.props.city
	}

	get latitude(): number | null | undefined {
		return this.props.latitude
	}

	get longitude(): number | null | undefined {
		return this.props.longitude
	}

	get timezone(): string | null | undefined {
		return this.props.timezone
	}

	//JSON Method
	toJSON(): GeolocationProps {
		return {
			country: this.props.country,
			region: this.props.region,
			city: this.props.city,
			latitude: this.props.latitude,
			longitude: this.props.longitude,
			timezone: this.props.timezone,
		}
	}

	// Methods
	public static create(props: GeolocationProps): Geolocation {
		const geolocation = new Geolocation(props)
		geolocation.validate()
		return geolocation
	}

	/**
	 * Restores a Geolocation from props already stored in the DB.
	 * Bypasses lat/lng validation — assumes the stored data is already valid.
	 */
	public static reconstitute(props: GeolocationProps): Geolocation {
		return new Geolocation(props)
	}

	private validate(): void {
		if (
			this.props.latitude === undefined ||
			this.props.latitude === null ||
			this.props.latitude < -90 ||
			this.props.latitude > 90
		) {
			throw new InvalidGeolocationError('Invalid latitude')
		}
		if (
			this.props.longitude === undefined ||
			this.props.longitude === null ||
			this.props.longitude < -180 ||
			this.props.longitude > 180
		) {
			throw new InvalidGeolocationError('Invalid longitude')
		}
	}
}

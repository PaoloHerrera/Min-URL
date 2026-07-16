export interface GeolocationProps {
	ipAddress: string
	country?: string | null
	region?: string | null
	city?: string | null
	zipCode?: string | null
	latitude?: number | null
	longitude?: number | null
	timezone?: string | null
	isVpn?: boolean | null
	isp?: string | null
	createdAt: Date
	updatedAt: Date
	deletedAt?: Date | null
}

export class Geolocation {
	private readonly props: Readonly<GeolocationProps>

	constructor(props: GeolocationProps) {
		this.props = props
	}

	// Getters
	get ipAddress(): string {
		return this.props.ipAddress
	}

	get country(): string | null | undefined {
		return this.props.country
	}

	get region(): string | null | undefined {
		return this.props.region
	}

	get city(): string | null | undefined {
		return this.props.city
	}

	get zipCode(): string | null | undefined {
		return this.props.zipCode
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

	get isVpn(): boolean | null | undefined {
		return this.props.isVpn
	}

	get isp(): string | null | undefined {
		return this.props.isp
	}

	get createdAt(): Date {
		return this.props.createdAt
	}

	get updatedAt(): Date {
		return this.props.updatedAt
	}

	get deletedAt(): Date | null | undefined {
		return this.props.deletedAt
	}

	//JSON Method
	toJSON(): GeolocationProps {
		return {
			ipAddress: this.props.ipAddress,
			country: this.props.country,
			region: this.props.region,
			city: this.props.city,
			zipCode: this.props.zipCode,
			latitude: this.props.latitude,
			longitude: this.props.longitude,
			timezone: this.props.timezone,
			isVpn: this.props.isVpn,
			isp: this.props.isp,
			createdAt: this.props.createdAt,
			updatedAt: this.props.updatedAt,
			deletedAt: this.props.deletedAt,
		}
	}

	// Methods
	public static create(props: GeolocationProps): Geolocation {
		return new Geolocation(props)
	}
}

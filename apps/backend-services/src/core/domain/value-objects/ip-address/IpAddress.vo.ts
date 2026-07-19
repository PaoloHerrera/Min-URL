import { InvalidIpAddressError } from '../../errors/domain.errors.ts'
import type { Geolocation } from '../geolocation/Geolocation.vo.ts'
import { ipSchema } from './ipAddress.schema.ts'

export interface IpAddressProps {
	ipAddress: string
	geolocation?: Geolocation | null
}

export class IpAddress {
	private readonly props: Readonly<IpAddressProps>

	private constructor(props: Readonly<IpAddressProps>) {
		this.props = props
	}

	// Getters
	get ipAddress(): string {
		return this.props.ipAddress
	}

	get geolocation(): Geolocation | null | undefined {
		return this.props.geolocation
	}

	// Methods
	static createOrUnknown(value: string): IpAddress {
		const parsed = ipSchema.safeParse({ ipAddress: value })

		if (!parsed.success) {
			return new IpAddress({ ipAddress: 'unknown', geolocation: null })
		}
		return new IpAddress({
			ipAddress: parsed.data.ipAddress,
			geolocation: null,
		})
	}

	static create(value: string): IpAddress {
		const parsed = ipSchema.safeParse({ ipAddress: value })

		if (!parsed.success) {
			throw new InvalidIpAddressError(value)
		}
		return new IpAddress({
			ipAddress: parsed.data.ipAddress,
			geolocation: null,
		})
	}

	/**
	 * Restores an IpAddress from props already stored in the DB.
	 * Bypasses validation — handles 'unknown' sentinel and pre-validated IPs.
	 */
	static reconstitute(props: IpAddressProps): IpAddress {
		return new IpAddress(props)
	}

	toJSON(): { ipAddress: string } {
		return {
			ipAddress: this.ipAddress,
		}
	}
}

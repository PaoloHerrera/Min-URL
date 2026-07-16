import type { Geolocation } from '../value-objects/Geolocation.ts'

export interface ShortUrlProps {
	slug: string
	originalUrl: string
	purpose: 'direct' | 'qr' | 'api'
	title: string
	passwordHash?: string | null
	expirationDate?: Date | null
	expiredAt?: Date | null
	geolocation?: Geolocation | null
	createdAt: Date
	updatedAt: Date
	deletedAt?: Date | null
}

export class ShortUrl {
	private readonly props: ShortUrlProps

	constructor(props: ShortUrlProps) {
		this.props = props
	}

	// Getters
	get slug(): string {
		return this.props.slug
	}

	get title(): string {
		return this.props.title
	}

	get originalUrl(): string {
		return this.props.originalUrl
	}

	get purpose(): 'direct' | 'qr' | 'api' {
		return this.props.purpose
	}

	get passwordHash(): string | null | undefined {
		return this.props.passwordHash
	}

	get expirationDate(): Date | null | undefined {
		return this.props.expirationDate
	}

	get expiredAt(): Date | null | undefined {
		return this.props.expiredAt
	}

	get geolocation(): Geolocation | null | undefined {
		return this.props.geolocation
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
	toJSON(): ShortUrlProps {
		return {
			slug: this.props.slug,
			title: this.props.title,
			originalUrl: this.props.originalUrl,
			purpose: this.props.purpose,
			passwordHash: this.props.passwordHash,
			expirationDate: this.props.expirationDate,
			expiredAt: this.props.expiredAt,
			geolocation: this.props.geolocation,
			createdAt: this.props.createdAt,
			updatedAt: this.props.updatedAt,
			deletedAt: this.props.deletedAt,
		}
	}

	// Methods
	public static create(props: ShortUrlProps): ShortUrl {
		return new ShortUrl(props)
	}

	public delete(): void {
		const now = new Date()
		this.props.deletedAt = now
		this.props.updatedAt = now
	}

	public isDeleted(): boolean {
		return !!this.props.deletedAt
	}

	public restore(): void {
		this.props.deletedAt = null
		this.props.updatedAt = new Date()
	}

	public setExpired(expiredAt: Date): void {
		this.props.expiredAt = expiredAt
		this.props.updatedAt = new Date()
	}

	public isExpired(): boolean {
		return !!this.props.expiredAt && this.props.expiredAt < new Date()
	}

	public unsetExpired(): void {
		this.props.expiredAt = null
		this.props.updatedAt = new Date()
	}

	public setPassword(passwordHash: string): void {
		this.props.passwordHash = passwordHash
		this.props.updatedAt = new Date()
	}

	public removePassword(): void {
		this.props.passwordHash = null
		this.props.updatedAt = new Date()
	}
}

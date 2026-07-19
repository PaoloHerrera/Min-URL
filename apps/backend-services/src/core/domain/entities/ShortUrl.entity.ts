import { v7 as uuidv7 } from 'uuid'
import type { IpAddress } from '../value-objects/ip-address/IpAddress.vo.ts'
import type { Password } from '../value-objects/password/Password.vo.ts'
import type { Slug } from '../value-objects/slug/Slug.vo.ts'
import type { TargetUrl } from '../value-objects/target-url/TargetUrl.vo.ts'

export type CreateShortUrlInput = Omit<
	ShortUrlProps,
	'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'expiredAt'
>

export interface ShortUrlProps {
	id: string
	slug: Slug
	originalUrl: TargetUrl
	ipAddress: IpAddress
	purpose: 'direct' | 'qr' | 'api'
	title: string | 'Untitled'
	passwordHash?: Password | null
	expirationDate?: Date | null
	expiredAt?: Date | null
	createdAt?: Date | null
	updatedAt?: Date | null
	deletedAt?: Date | null
}

export class ShortUrl {
	private readonly props: ShortUrlProps

	private constructor(props: ShortUrlProps) {
		this.props = props
	}

	// Getters

	get id(): string {
		return this.props.id
	}

	get ipAddress(): IpAddress {
		return this.props.ipAddress
	}

	get slug(): Slug {
		return this.props.slug
	}

	get title(): string {
		return this.props.title
	}

	get originalUrl(): TargetUrl {
		return this.props.originalUrl
	}

	get purpose(): 'direct' | 'qr' | 'api' {
		return this.props.purpose
	}

	get passwordHash(): Password | null | undefined {
		return this.props.passwordHash
	}

	get expirationDate(): Date | null | undefined {
		return this.props.expirationDate
	}

	get expiredAt(): Date | null | undefined {
		return this.props.expiredAt
	}

	get createdAt(): Date | null | undefined {
		return this.props.createdAt
	}

	get updatedAt(): Date | null | undefined {
		return this.props.updatedAt
	}

	get deletedAt(): Date | null | undefined {
		return this.props.deletedAt
	}

	//JSON Method
	toJSON(): ShortUrlProps {
		return {
			id: this.props.id,
			slug: this.props.slug,
			title: this.props.title,
			originalUrl: this.props.originalUrl,
			ipAddress: this.props.ipAddress,
			purpose: this.props.purpose,
			passwordHash: this.props.passwordHash,
			expirationDate: this.props.expirationDate,
			expiredAt: this.props.expiredAt,
			createdAt: this.props.createdAt,
			updatedAt: this.props.updatedAt,
			deletedAt: this.props.deletedAt,
		}
	}

	// Methods
	public static create(input: CreateShortUrlInput): ShortUrl {
		const now = new Date()
		return new ShortUrl({
			...input,
			id: uuidv7(),
			createdAt: now,
			updatedAt: now,
		})
	}

	/**
	 * Restores a ShortUrl from props already stored in the DB.
	 * Bypasses ID generation — preserves the existing ID from persistence.
	 */
	public static reconstitute(props: ShortUrlProps): ShortUrl {
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

	public setPassword(passwordHash: Password): void {
		this.props.passwordHash = passwordHash
		this.props.updatedAt = new Date()
	}

	public removePassword(): void {
		this.props.passwordHash = null
		this.props.updatedAt = new Date()
	}
}

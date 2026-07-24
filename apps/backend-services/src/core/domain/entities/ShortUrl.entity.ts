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
	createdAt: Date
	updatedAt: Date
	deletedAt?: Date | null
}

export class ShortUrl {
	private readonly _id: Readonly<string>
	private _slug: Slug
	private readonly _originalUrl: TargetUrl
	private readonly _ipAddress: IpAddress
	private _purpose: 'direct' | 'qr' | 'api'
	private _title: string
	private _passwordHash: Password | null
	private readonly _expirationDate: Readonly<Date | null>
	private _expiredAt: Date | null
	private readonly _createdAt: Readonly<Date>
	private _updatedAt: Date
	private _deletedAt: Date | null

	private constructor(props: Readonly<ShortUrlProps>) {
		this._id = props.id
		this._slug = props.slug
		this._originalUrl = props.originalUrl
		this._ipAddress = props.ipAddress
		this._purpose = props.purpose
		this._title = props.title
		this._passwordHash = props.passwordHash ?? null
		this._expirationDate = props.expirationDate ?? null
		this._expiredAt = props.expiredAt ?? null
		this._createdAt = props.createdAt
		this._updatedAt = props.updatedAt
		this._deletedAt = props.deletedAt ?? null
	}

	// Getters

	get id(): string {
		return this._id
	}

	get ipAddress(): IpAddress {
		return this._ipAddress
	}

	get slug(): Slug {
		return this._slug
	}

	get title(): string {
		return this._title
	}

	get originalUrl(): TargetUrl {
		return this._originalUrl
	}

	get purpose(): 'direct' | 'qr' | 'api' {
		return this._purpose
	}

	get passwordHash(): Password | null {
		return this._passwordHash
	}

	get expirationDate(): Date | null {
		return this._expirationDate
	}

	get expiredAt(): Date | null {
		return this._expiredAt
	}

	get createdAt(): Date {
		return this._createdAt
	}

	get updatedAt(): Date {
		return this._updatedAt
	}

	get deletedAt(): Date | null {
		return this._deletedAt
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
		this._deletedAt = now
		this._updatedAt = now
	}

	public isDeleted(): boolean {
		return !!this._deletedAt
	}

	public restore(): void {
		this._deletedAt = null
		this._updatedAt = new Date()
	}

	public setExpired(expiredAt: Date): void {
		this._expiredAt = expiredAt
		this._updatedAt = new Date()
	}

	public isExpired(): boolean {
		return !!this._expiredAt && this._expiredAt < new Date()
	}

	public unsetExpired(): void {
		this._expiredAt = null
		this._updatedAt = new Date()
	}

	public setPassword(passwordHash: Password): void {
		this._passwordHash = passwordHash
		this._updatedAt = new Date()
	}

	public removePassword(): void {
		this._passwordHash = null
		this._updatedAt = new Date()
	}
}

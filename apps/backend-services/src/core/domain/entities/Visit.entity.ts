import { v7 as uuidv7 } from 'uuid'
import { InvalidVisitError } from '../errors/domain.errors.ts'
import { IpAddress } from '../value-objects/ip-address/IpAddress.vo.ts'
import { Referer } from '../value-objects/referer/Referer.vo.ts'
import { UserAgent } from '../value-objects/user-agent/UserAgent.vo.ts'

export interface CreateVisitInput {
	shortUrlId: string
	ipAddress?: IpAddress | null
	userAgent?: UserAgent | null
	referer?: Referer | null
}

export interface VisitProps {
	id: string
	shortUrlId: string
	ipAddress: IpAddress
	userAgent: UserAgent
	referer: Referer
	visitedAt: Date
}

export class Visit {
	private readonly _id: string
	private readonly _shortUrlId: string
	private readonly _ipAddress: IpAddress
	private readonly _userAgent: UserAgent
	private readonly _referer: Referer
	private readonly _visitedAt: Date

	private constructor(props: Readonly<VisitProps>) {
		this._id = props.id
		this._shortUrlId = props.shortUrlId
		this._ipAddress = props.ipAddress
		this._userAgent = props.userAgent
		this._referer = props.referer
		this._visitedAt = new Date(props.visitedAt.getTime())
	}

	// Getters
	get id(): string {
		return this._id
	}

	get shortUrlId(): string {
		return this._shortUrlId
	}

	get ipAddress(): IpAddress {
		return this._ipAddress
	}

	get userAgent(): UserAgent {
		return this._userAgent
	}

	get referer(): Referer {
		return this._referer
	}

	get visitedAt(): Date {
		return new Date(this._visitedAt.getTime())
	}

	// Factory Methods
	public static create(input: CreateVisitInput): Visit {
		if (!input.shortUrlId || input.shortUrlId.trim() === '') {
			throw new InvalidVisitError()
		}

		return new Visit({
			id: uuidv7(),
			shortUrlId: input.shortUrlId.trim(),
			ipAddress: input.ipAddress ?? IpAddress.createOrUnknown('unknown'),
			userAgent: input.userAgent ?? UserAgent.create('unknown'),
			referer: input.referer ?? Referer.create('direct'),
			visitedAt: new Date(),
		})
	}

	public static reconstitute(props: VisitProps): Visit {
		return new Visit(props)
	}
}

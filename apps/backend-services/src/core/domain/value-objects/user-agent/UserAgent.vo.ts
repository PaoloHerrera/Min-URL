import type {
	SupportedBrowser,
	SupportedDevice,
	SupportedOS,
} from '@min-url/contracts/analytics'
import { type ParsedUserAgent, parseUserAgent } from './userAgent.parser.ts'

export interface UserAgentProps {
	value: string
	browser: SupportedBrowser
	os: SupportedOS
	device: SupportedDevice
}

export class UserAgent {
	private readonly props: Readonly<UserAgentProps>
	private static readonly MAX_LENGTH = 512

	private constructor(value: string, parsedProps?: ParsedUserAgent) {
		const sanitizedValue = UserAgent.sanitize(value)
		const parsed = parsedProps ?? parseUserAgent(sanitizedValue)

		this.props = Object.freeze({
			value: sanitizedValue,
			browser: parsed.browser,
			os: parsed.os,
			device: parsed.device,
		})
	}

	get value(): string {
		return this.props.value
	}

	get browser(): SupportedBrowser {
		return this.props.browser
	}

	get os(): SupportedOS {
		return this.props.os
	}

	get device(): SupportedDevice {
		return this.props.device
	}

	private static sanitize(raw: string): string {
		if (!raw || raw.trim() === '') {
			return 'unknown'
		}
		const trimmed = raw.trim()
		return trimmed.length > UserAgent.MAX_LENGTH
			? trimmed.slice(0, UserAgent.MAX_LENGTH)
			: trimmed
	}

	public static create(value?: string | null): UserAgent {
		return new UserAgent(value ?? 'unknown')
	}

	public static reconstitute(
		value: string,
		parsed?: ParsedUserAgent,
	): UserAgent {
		return new UserAgent(value, parsed)
	}
}

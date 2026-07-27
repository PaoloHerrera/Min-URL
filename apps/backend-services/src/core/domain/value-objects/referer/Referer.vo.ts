export interface RefererProps {
	value: string
	domain: string
}

const WWW_PREFIX_REGEX = /^www\./

export class Referer {
	private readonly props: Readonly<RefererProps>
	private static readonly MAX_LENGTH = 2048

	private constructor(props: RefererProps) {
		this.props = Object.freeze(props)
	}

	get value(): string {
		return this.props.value
	}

	get domain(): string {
		return this.props.domain
	}

	private static sanitize(raw: string): string {
		const trimmed = raw.trim()
		return trimmed.length > Referer.MAX_LENGTH
			? trimmed.slice(0, Referer.MAX_LENGTH)
			: trimmed
	}

	private static extractDomain(urlStr: string): string {
		if (urlStr === 'direct') {
			return 'direct'
		}

		try {
			const parsed = new URL(urlStr)
			return parsed.hostname.replace(WWW_PREFIX_REGEX, '')
		} catch (_error) {
			return 'unknown'
		}
	}

	public static create(value?: string | null): Referer {
		if (!value || value.trim() === '' || value.trim() === 'direct') {
			return new Referer({ value: 'direct', domain: 'direct' })
		}

		const sanitizedValue = Referer.sanitize(value)
		const extractedDomain = Referer.extractDomain(sanitizedValue)

		return new Referer({
			value: sanitizedValue,
			domain: extractedDomain,
		})
	}

	public static reconstitute(props: RefererProps): Referer {
		return new Referer(props)
	}
}

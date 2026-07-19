import { InvalidUrlError } from '../../errors/domain.errors.ts'
import { urlSchema } from './url.schema.ts'

export class TargetUrl {
	private readonly _value: Readonly<string>

	private constructor(_value: Readonly<string>) {
		this._value = _value
	}

	get value(): string {
		return this._value
	}

	public static create(_value: string): TargetUrl {
		const parsed = urlSchema.safeParse({ url: _value })

		if (!parsed.success) {
			throw new InvalidUrlError(_value)
		}
		return new TargetUrl(parsed.data.url)
	}

	/**
	 * Restores a TargetUrl from a value already stored in the DB.
	 * Bypasses schema validation — assumes the stored value is already valid.
	 */
	public static reconstitute(value: string): TargetUrl {
		return new TargetUrl(value)
	}
}

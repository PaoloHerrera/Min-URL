import { slugRegex } from '@min-url/contracts/schemas'
import { InvalidSlugError } from '../../errors/domain.errors.ts'

export class Slug {
	private readonly _value: Readonly<string>

	private constructor(value: Readonly<string>) {
		this._value = value
	}

	get value(): string {
		return this._value
	}

	static create(value: string): Slug {
		const slug = new Slug(value)
		slug.validate()
		return slug
	}

	/**
	 * Restores a Slug from a value already stored in the DB.
	 * Bypasses validation — assumes the stored value is already valid.
	 */
	static reconstitute(value: string): Slug {
		return new Slug(value)
	}

	private validate(): void {
		if (!slugRegex.test(this.value)) {
			throw new InvalidSlugError()
		}
	}
}

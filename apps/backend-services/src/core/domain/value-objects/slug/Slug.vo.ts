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
		const minLength = 6
		const maxLength = 12
		const slugRegex = new RegExp(`^[a-zA-Z0-9]{${minLength},${maxLength}}$`)
		if (!slugRegex.test(this.value)) {
			throw new InvalidSlugError(this.value)
		}
	}
}

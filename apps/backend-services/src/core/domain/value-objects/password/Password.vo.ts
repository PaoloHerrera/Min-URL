import crypto from 'node:crypto'
import { InvalidPasswordError } from '../../errors/domain.errors.ts'
import { passwordSchema } from './password.schema.ts'

export class Password {
	private readonly hashedPassword: Readonly<string>

	private constructor(hashedPassword: Readonly<string>) {
		this.hashedPassword = hashedPassword
	}

	get hash(): string {
		return this.hashedPassword
	}

	static create(password: string): Password {
		const validate = passwordSchema.safeParse({ password })
		if (!validate.success) {
			throw new InvalidPasswordError()
		}
		const salt = crypto.randomBytes(16).toString('hex')
		const hash = crypto.scryptSync(password, salt, 64).toString('hex')
		return new Password(`${salt}:${hash}`)
	}

	/**
	 * Verifies a plain-text password against the stored hash.
	 * Uses timingSafeEqual to prevent timing attacks.
	 */
	verify(plainPassword: string): boolean {
		const [salt, storedHash] = this.hashedPassword.split(':')
		const derivedHash = crypto
			.scryptSync(plainPassword, salt, 64)
			.toString('hex')
		return crypto.timingSafeEqual(
			Buffer.from(derivedHash, 'hex'),
			Buffer.from(storedHash, 'hex'),
		)
	}

	/**
	 * Restores a Password from an already-hashed value retrieved from the DB.
	 * Bypasses validation — the value must be a valid 'salt:hash' string.
	 */
	static reconstitute(storedHash: string): Password {
		return new Password(storedHash)
	}
}

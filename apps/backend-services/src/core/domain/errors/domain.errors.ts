import type { DomainErrorCodes } from '@min-url/contracts/errors'
import { SLUG_ERROR, VALIDATION_ERROR } from '@min-url/contracts/errors'

export abstract class DomainError extends Error {
	abstract readonly code: DomainErrorCodes

	constructor(message: string) {
		super(message)
		this.name = this.constructor.name
		Object.setPrototypeOf(this, new.target.prototype)
	}
}

export class InvalidUrlError extends DomainError {
	readonly code = VALIDATION_ERROR.invalidUrl.code
	constructor() {
		super(VALIDATION_ERROR.invalidUrl.message)
	}
}

export class InvalidSlugError extends DomainError {
	readonly code = SLUG_ERROR.invalidSlug.code
	constructor() {
		super(SLUG_ERROR.invalidSlug.message)
	}
}

export class InvalidGeolocationError extends DomainError {
	readonly code = VALIDATION_ERROR.invalidGeolocation.code
	constructor() {
		super(VALIDATION_ERROR.invalidGeolocation.message)
	}
}

export class InvalidVisitError extends DomainError {
	readonly code = VALIDATION_ERROR.invalidVisit.code
	constructor() {
		super(VALIDATION_ERROR.invalidVisit.message)
	}
}

export class ForbiddenExtensionError extends DomainError {
	readonly code = VALIDATION_ERROR.forbiddenExtension.code
	constructor() {
		super(VALIDATION_ERROR.forbiddenExtension.message)
	}
}

export class SlugGenerationExhaustedError extends DomainError {
	readonly code = SLUG_ERROR.slugGenerationExhausted.code
	constructor() {
		super(SLUG_ERROR.slugGenerationExhausted.message)
	}
}

export class SlugNotFoundError extends DomainError {
	readonly code = SLUG_ERROR.slugNotFound.code
	constructor() {
		super(SLUG_ERROR.slugNotFound.message)
	}
}

export class SlugIsExpiredError extends DomainError {
	readonly code = SLUG_ERROR.slugIsExpired.code
	constructor() {
		super(SLUG_ERROR.slugIsExpired.message)
	}
}

export class SlugIsDeletedError extends DomainError {
	readonly code = SLUG_ERROR.slugIsDeleted.code
	constructor() {
		super(SLUG_ERROR.slugIsDeleted.message)
	}
}

export class SlugAlreadyExistsError extends DomainError {
	readonly code = SLUG_ERROR.slugAlreadyExists.code
	constructor() {
		super(SLUG_ERROR.slugAlreadyExists.message)
	}
}

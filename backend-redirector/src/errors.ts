export class LinkNotFoundError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'LinkNotFoundError'
	}
}

export class InternalApiError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'InternalApiError'
	}
}

export class NetworkError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'NetworkError'
	}
}

export class EnvironmentError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'EnvironmentError'
	}
}

export class SlugFormatError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'SlugFormatError'
	}
}

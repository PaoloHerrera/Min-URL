import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import {
	EnvironmentError,
	InternalApiError,
	LinkNotFoundError,
	NetworkError,
	SlugFormatError,
} from './errors.ts'

export const errorHandler = (
	err: FastifyError,
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4321'

	if (err instanceof LinkNotFoundError) {
		request.log.warn(`Link not found: ${err.message}`)
		return reply.redirect(`${frontendUrl}/link-not-found`)
	}

	if (err instanceof InternalApiError) {
		request.log.error(`Internal API error: ${err.message}`)
		return reply.redirect(`${frontendUrl}/error`)
	}

	if (err instanceof NetworkError) {
		request.log.error(`Network error: ${err.message}`)
		return reply.redirect(`${frontendUrl}/error`)
	}

	if (err instanceof EnvironmentError) {
		request.log.error(`Environment error: ${err.message}`)
		return reply.redirect(`${frontendUrl}/error`)
	}

	if (err instanceof SlugFormatError || err.validation) {
		request.log.warn(`Slug format error: ${err.message}`)
		return reply.redirect(`${frontendUrl}/link-not-found`)
	}

	request.log.error(`Unexpected error: ${err.message}`)
	return reply.status(500).send('Internal Server Error')
}

import Fastify from 'fastify'
import {
	type ZodTypeProvider,
	serializerCompiler,
	validatorCompiler,
} from 'fastify-type-provider-zod'
import { errorHandler } from './errorHandler.ts'
import { env } from './config/env.ts'
import { getSlugSchema, slugDataSchema } from './schemas/routes.schemas.ts'

export const app = Fastify({
	logger: env.NODE_ENV !== 'test',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler(errorHandler)

app
	.withTypeProvider<ZodTypeProvider>()
	.get('/:slug', { schema: getSlugSchema }, async (request, reply) => {
		const { slug } = request.params

		try {
			const response = await fetch(
				`${env.BACKEND_API_URL}/internal/slug-data/${slug}`,
				{
					method: 'GET',
					headers: {
						// biome-ignore lint/style/useNamingConvention: API requires uppercase headers
						Authorization: `Bearer ${env.INTERNAL_SECRET}`,
						// biome-ignore lint/style/useNamingConvention: API requires uppercase headers
						Accept: 'application/json',
					},
				},
			)

			if (response.status === 404) {
				return reply.redirect(`${env.FRONTEND_URL}/link-not-found`)
			}

			if (!response.ok) {
				return reply.redirect(`${env.FRONTEND_URL}/error`)
			}

			const rawData = await response.json()

			const data = await slugDataSchema.parseAsync(rawData)

			if (data.password) {
				return reply.redirect(
					`${env.FRONTEND_URL}/password-protected?slug=${encodeURIComponent(slug)}`,
				)
			}

			return reply.redirect(data.originalUrl as string)
		} catch (error) {
			app.log.error(`Error al obtener el slug: ${error}`)
			return reply.redirect(`${env.FRONTEND_URL}/error`)
		}
	})

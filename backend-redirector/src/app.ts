import Fastify from 'fastify'
import {
	type ZodTypeProvider,
	serializerCompiler,
	validatorCompiler,
} from 'fastify-type-provider-zod'
import { errorHandler } from './errorHandler.ts'
import { envSchema } from './schemas/env.schemas.ts'
import { getSlugSchema, slugDataSchema } from './schemas/routes.schemas.ts'

export const app = Fastify({
	logger: process.env.NODE_ENV !== 'test',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler(errorHandler)

app
	.withTypeProvider<ZodTypeProvider>()
	.get('/:slug', { schema: getSlugSchema }, async (request, reply) => {
		const { slug } = request.params

		const envResult = envSchema.safeParse(process.env)

		if (!envResult.success) {
			const formattedErrors = envResult.error.format()

			if (formattedErrors.FRONTEND_URL) {
				app.log.error('FRONTEND_URL is not defined')
				return reply.status(500).send('Internal Server Error')
			}

			app.log.error('BACKEND_API_URL or INTERNAL_SECRET is not defined')
			return reply.redirect(`${process.env.FRONTEND_URL}/error`)
		}

		const { FRONTEND_URL, BACKEND_API_URL, INTERNAL_SECRET } = envResult.data

		try {
			const response = await fetch(
				`${BACKEND_API_URL}/internal/slug-data/${slug}`,
				{
					method: 'GET',
					headers: {
						// biome-ignore lint/style/useNamingConvention: API requires uppercase headers
						Authorization: `Bearer ${INTERNAL_SECRET}`,
						// biome-ignore lint/style/useNamingConvention: API requires uppercase headers
						Accept: 'application/json',
					},
				},
			)

			if (response.status === 404) {
				return reply.redirect(`${FRONTEND_URL}/link-not-found`)
			}

			if (!response.ok) {
				return reply.redirect(`${FRONTEND_URL}/error`)
			}

			const rawData = await response.json()

			const data = await slugDataSchema.parseAsync(rawData)

			if (data.password) {
				return reply.redirect(
					`${FRONTEND_URL}/password-protected?slug=${encodeURIComponent(slug)}`,
				)
			}

			return reply.redirect(data.originalUrl as string)
		} catch (error) {
			app.log.error(`Error al obtener el slug: ${error}`)
			return reply.redirect(`${FRONTEND_URL}/error`)
		}
	})

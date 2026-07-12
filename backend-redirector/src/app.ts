import Fastify from 'fastify'

export const app = Fastify({
	logger: process.env.NODE_ENV !== 'test',
})

// Enviroment variables
const BACKEND_API_URL = process.env.BACKEND_API_URL
const INTERNAL_SECRET = process.env.INTERNAL_SECRET
const FRONTEND_URL = process.env.FRONTEND_URL

interface Params {
	slug: string
}

// Declare a temporary mock route for redirecting
// biome-ignore lint/style/useNamingConvention: Fastify requires uppercase
app.get<{ Params: Params }>('/:slug', async (request, reply) => {
	const { slug } = request.params

	try {
		const response = await fetch(`${BACKEND_API_URL}/slug/${slug}`, {
			method: 'GET',
			headers: {
				// biome-ignore lint/style/useNamingConvention: API requires uppercase headers
				Authorization: `Bearer ${INTERNAL_SECRET}`,
				// biome-ignore lint/style/useNamingConvention: API requires uppercase headers
				Accept: 'application/json',
			},
		})

		if (response.status === 404) {
			return reply.redirect(`${FRONTEND_URL}/link-not-found`)
		}

		if (!response.ok) {
			return reply.redirect(`${FRONTEND_URL}/error`)
		}

		const data = await response.json()

		console.log(data)
	} catch (error) {
		app.log.error(`Error al obtener el slug: ${error}`)

		return reply.redirect(`${FRONTEND_URL}/error`)
	}
})

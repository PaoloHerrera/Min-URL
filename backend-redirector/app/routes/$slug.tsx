import type { LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import axios from 'axios'
import { VITE_API_KEY, VITE_API_URL, VITE_LOCAL_IP } from '~/constants'
import { getClientIPAddress } from 'remix-utils/get-client-ip-address'
import { publishClick } from '~/config/redis'
import { getDiviceType } from '~/utils/getDiviceType'

export async function loader({ request, params }: LoaderFunctionArgs) {
	const { slug } = params as { slug: string }
	const ip = getClientIPAddress(request) || VITE_LOCAL_IP

	try {
		const { data } = await axios.get(
			`${VITE_API_URL}/protected/slug-data/${slug}`,
			{
				headers: {
					'Content-Type': 'application/json',
					'X-API-Key': `${VITE_API_KEY}`,
				},
			},
		)

		// Si no tiene password, se guarda en redis y redirige
		if (!data.password) {
			const userAgent = request.headers.get('user-agent')
			const deviceType = getDiviceType(userAgent || '')

			const clickData = {
				idUrl: data.id_urls,
				url: data.long_url,
				slug,
				ip,
				timestamp: Date.now(),
				userAgent,
				referer: request.headers.get('referer'),
				deviceType,
			}

			publishClick(clickData)

			return redirect(data.long_url)
		}
		return { data }
	} catch {
		return { data: false }
	}
}

// biome-ignore lint/style/noDefaultExport: Remix Router will handle this
export default function Slug() {
	const { data } = useLoaderData<typeof loader>()
	console.log('Datos frontend:', data)

	// Si no hay data o es false, mostramos error
	if (!data || data === false) {
		return <div>URL no encontrada</div>
	}

	// Si tiene password, se muestra un form para ingresar
	return <div>URL con password: {data.long_url}</div>
}

import axios from 'axios'

const backendUrl = import.meta.env.PUBLIC_BACKEND_URL || ''

interface ShortenAnonRequestBody {
	originalUrl: string
	turnstileToken: string
}

interface ShortenApiResponse {
	shortUrl: string
}

export const shortenAnonService = async ({
	originalUrl,
	turnstileToken,
}: ShortenAnonRequestBody): Promise<string> => {
	const { data } = await axios.post<ShortenApiResponse>(
		`${backendUrl}/direct/shorten`,
		{
			originalUrl,
			turnstileToken,
		},
	)
	return data.shortUrl
}

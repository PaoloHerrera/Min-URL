import axios from 'axios'

const backendUrl = import.meta.env.PUBLIC_BACKEND_URL || ''

interface ShortenApiResponse {
	shortUrl: string
}

export const shortenAnonService = async (longUrl: string): Promise<string> => {
	const { data } = await axios.post<ShortenApiResponse>(
		`${backendUrl}/direct/shorten`,
		{
			originalUrl: longUrl,
		},
	)
	return data.shortUrl
}

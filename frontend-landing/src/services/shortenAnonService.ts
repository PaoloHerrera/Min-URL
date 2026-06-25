import axios from 'axios'

interface ShortenApiResponse {
	shortUrl: string
}

export const shortenAnonService = async (longUrl: string): Promise<string> => {
	const { data } = await axios.post<ShortenApiResponse>(
		`${import.meta.env.VITE_SHORT_URL_DIRECT}/direct/shorten`,
		{ originalUrl: longUrl },
	)
	return data.shortUrl
}

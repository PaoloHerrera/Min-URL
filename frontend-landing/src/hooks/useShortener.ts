import { shortenAnonService } from '@/services/shortenAnonService'
import { useState } from 'react'

interface UseShortenerReturn {
	isLoading: boolean
	apiError: string
	shortUrl: string
	shorten: (longUrl: string) => void
	reset: () => void
}

export const useShortener = (): UseShortenerReturn => {
	const [isLoading, setIsLoading] = useState(false)
	const [shortUrl, setShortUrl] = useState('')
	const [apiError, setApiError] = useState('')

	const shorten = async (longUrl: string) => {
		if (isLoading) {
			return
		}

		setIsLoading(true)
		try {
			const urlResult = await shortenAnonService(longUrl)
			setShortUrl(urlResult)
		} catch (_error) {
			setApiError('Something went wrong. Please try again later.')
		} finally {
			setIsLoading(false)
		}
	}

	//reset
	const reset = () => {
		setShortUrl('')
		setApiError('')
	}

	return {
		shorten,
		isLoading,
		shortUrl,
		apiError,
		reset,
	}
}

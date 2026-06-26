import { shortenAnonService } from '@/services/shortenAnonService'
import { useState } from 'react'

interface UseShortenerProps {
	errorShortenFailedText: string
}

interface UseShortenerReturn {
	isLoading: boolean
	apiError: string
	shortUrl: string
	shorten: (longUrl: string) => void
	reset: () => void
}

export const useShortener = ({
	errorShortenFailedText,
}: UseShortenerProps): UseShortenerReturn => {
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
			setApiError(errorShortenFailedText)
		} finally {
			setIsLoading(false)
		}
	}

	//reset
	const reset = () => {
		setShortUrl('')
		setApiError('')
		setIsLoading(false)
	}

	return {
		shorten,
		isLoading,
		shortUrl,
		apiError,
		reset,
	}
}

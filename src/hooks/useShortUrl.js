import { useContext } from 'react'
import { ShortUrlContext } from '../context/ShortUrlContext'

export function useShortUrl() {
	const context = useContext(ShortUrlContext)

	if (context === undefined) {
		throw new Error('useShortUrl must be used within a ShortUrlProvider')
	}

	return context
}

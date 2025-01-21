import { useState } from 'react'

export function useRecaptcha(siteKey) {
	const [isLoaded, setIsLoaded] = useState(false)

	const loadRecaptcha = () => {
		if (isLoaded) return

		const script = document.createElement('script')
		script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
		script.async = true
		script.onload = () => {
			setIsLoaded(true)
		}
		document.head.appendChild(script)
	}
	return { isLoaded, loadRecaptcha }
}

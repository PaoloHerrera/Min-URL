import { useEffect, useRef, useState } from 'react'

interface UseTurnstileProps {
	sitekey: string
	containerId?: string
}

interface UseTurnstileReturn {
	turnstileToken: string | null
	resetTurnstile: () => void
}

export const useTurnstile = ({
	sitekey,
	containerId = 'turnstile-container',
}: UseTurnstileProps): UseTurnstileReturn => {
	const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
	const widgetIdRef = useRef<string | null>(null)

	useEffect(() => {
		const renderWidget = () => {
			if (window.turnstile) {
				const id = window.turnstile.render(`#${containerId}`, {
					sitekey,
					callback: (token: string) => {
						setTurnstileToken(token)
					},
					'expired-callback': () => {
						setTurnstileToken(null)
					},
					'error-callback': () => {
						setTurnstileToken(null)
					},
				})
				widgetIdRef.current = id
			}
		}

		if (window.turnstile) {
			renderWidget()
		} else {
			window.addEventListener('turnstile-loaded', renderWidget)
		}

		return () => {
			window.removeEventListener('turnstile-loaded', renderWidget)
			if (window.turnstile && widgetIdRef.current) {
				window.turnstile.remove(widgetIdRef.current)
			}
		}
	}, [sitekey, containerId])

	const resetTurnstile = () => {
		if (window.turnstile && widgetIdRef.current) {
			window.turnstile.reset(widgetIdRef.current)
		}
		setTurnstileToken(null)
	}

	return { turnstileToken, resetTurnstile }
}

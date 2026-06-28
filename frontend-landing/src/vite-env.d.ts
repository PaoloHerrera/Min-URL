/// <reference types="vite/client" />

interface TurnstileRenderOptions {
	sitekey: string
	callback?: (token: string) => void
	'error-callback'?: (error: unknown) => void
	'expired-callback'?: () => void
	action?: string
	cData?: string
	theme?: 'light' | 'dark' | 'auto'
	size?: 'normal' | 'flexible' | 'compact'
	retry?: 'auto' | 'never'
	'retry-interval'?: number
	mode?: 'non-interactive' | 'invisible' | 'managed'
}

// biome-ignore lint/correctness/noUnusedVariables: Window is not used directly but Turnstile is a global object
interface Window {
	turnstile?: {
		render: (
			container: string | HTMLElement,
			options: TurnstileRenderOptions,
		) => string
		reset: (widgetId?: string) => void
		remove: (widgetId?: string) => void
		getResponse: (widgetId?: string) => string | undefined
	}
}

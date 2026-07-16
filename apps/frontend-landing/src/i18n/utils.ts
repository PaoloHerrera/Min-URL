export type Lang = 'en' | 'es'

export const defaultLang: Lang = 'en'

export const supportedLangs: Lang[] = ['en', 'es']

/**
 * Derives the language from an Astro URL object.
 * - /         → 'en'
 * - /es/      → 'es'
 * - /es/...   → 'es'
 */
export function getLangFromUrl(url: URL): Lang {
	const [, firstSegment] = url.pathname.split('/')
	if (supportedLangs.includes(firstSegment as Lang)) {
		return firstSegment as Lang
	}
	return defaultLang
}

/**
 * Returns the alternate-language URL for the language switcher.
 * - 'en' → '/es/'
 * - 'es' → '/'
 */
export function getAlternateLangUrl(currentLang: Lang): string {
	return currentLang === 'en' ? '/es/' : '/'
}

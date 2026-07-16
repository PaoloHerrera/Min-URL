import type { Lang } from './utils.ts'

export interface LangOption {
	code: Lang
	label: string
	flag: string
	href: string
}

/**
 * Supported language options for the language switcher dropdown.
 * Add new languages here — the Navbar will render them automatically.
 */
export const langOptions: LangOption[] = [
	{ code: 'en', label: 'English', flag: '🇺🇸', href: '/' },
	{ code: 'es', label: 'Español', flag: '🇪🇸', href: '/es/' },
]

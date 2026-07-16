import type { Language } from '@/types'
import { create } from 'zustand'

type LanguageStore = {
	language: Language
	setLanguage: (language: Language) => void
}

const getInitialLanguage = (): Language => {
	//1. Get Query Params
	const queryParams = new URLSearchParams(window.location.search)
	const lang = queryParams.get('lang') as Language | null
	if (lang && ['en', 'es'].includes(lang)) {
		localStorage.setItem('language', lang)
		return lang as Language
	}

	//2. Get Local Storage
	const langLocalStorage = localStorage.getItem('language') as Language | null
	if (langLocalStorage && ['en', 'es'].includes(langLocalStorage)) {
		return langLocalStorage as Language
	}

	//3. Get Browser Language
	const browserLang = navigator.language
	if (browserLang.includes('es')) {
		localStorage.setItem('language', 'es')
		return 'es' as Language
	}

	//4. Default
	return 'en' as Language
}

export const useLanguageStore = create<LanguageStore>((set) => ({
	language: getInitialLanguage(),
	setLanguage: (language) => {
		localStorage.setItem('language', language)
		set({ language })
	},
}))

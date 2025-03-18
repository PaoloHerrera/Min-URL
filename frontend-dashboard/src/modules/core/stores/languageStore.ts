import { create } from 'zustand'
import type { Language } from '@/types'

type LanguageStore = {
	language: Language
	setLanguage: (language: Language) => void
}

export const useLanguageStore = create<LanguageStore>((set) => ({
	language: (localStorage.getItem('language') as Language) || 'en',
	setLanguage: (language) => {
		localStorage.setItem('language', language)
		set({ language })
	},
}))

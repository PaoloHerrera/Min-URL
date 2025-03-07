import { create } from 'zustand'

type LanguageStore = {
	language: 'es' | 'en'
	setLanguage: (language: 'es' | 'en') => void
}

export const useLanguageStore = create<LanguageStore>((set) => ({
	language: 'en',
	setLanguage: (language: 'es' | 'en') => set({ language }),
}))

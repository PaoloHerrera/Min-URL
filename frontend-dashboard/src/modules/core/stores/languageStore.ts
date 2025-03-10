import { create } from 'zustand'
import type { Language } from '@/types'

type LanguageStore = {
	language: Language
	setLanguage: (language: Language) => void
}

export const useLanguageStore = create<LanguageStore>((set) => ({
	language: 'en',
	setLanguage: (language: Language) => set({ language }),
}))

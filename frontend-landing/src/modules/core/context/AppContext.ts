import { createContext } from 'react'
import type { State } from '@/modules/core/reducers/AppReducer.ts'

type AppContextType = {
	lang: State['lang']
	setLang: (lang: State['lang']) => void
}

export const AppContext = createContext<AppContextType | null>(null)

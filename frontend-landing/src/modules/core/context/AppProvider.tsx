import type React from 'react'
import { AppContext } from './AppContext.ts'
import { useAppReducer } from '@/modules/core/hooks/useAppReducer'

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
	const appState = useAppReducer()

	return <AppContext.Provider value={appState}>{children}</AppContext.Provider>
}

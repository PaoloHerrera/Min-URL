import { useAppReducer } from '@/modules/core/hooks/useAppReducer'
import type React from 'react'
import { AppContext } from './AppContext.ts'

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
	const appState = useAppReducer()

	return <AppContext.Provider value={appState}>{children}</AppContext.Provider>
}

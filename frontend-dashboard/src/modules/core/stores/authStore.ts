import { create } from 'zustand'

interface AuthStore {
	isAuthenticated: boolean
	user: null | { name: string; email: string }
	setAuthenticated: (
		isAuthenticated: boolean,
		user?: { name: string; email: string },
	) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
	isAuthenticated: false,
	user: null,
	setAuthenticated: (
		isAuthenticated: boolean,
		user?: { name: string; email: string },
	) => set({ isAuthenticated, user }),
}))

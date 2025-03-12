import { create } from 'zustand'

interface User {
	displayName?: string
	givenName?: string
	familyName?: string
	email: string
	avatar?: string
}

interface AuthStore {
	isAuthenticated: boolean
	user: null | User
	setAuthenticated: (isAuthenticated: boolean, user?: User) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
	isAuthenticated: false,
	user: null,
	setAuthenticated: (isAuthenticated: boolean, user?: User) =>
		set({ isAuthenticated, user }),
}))

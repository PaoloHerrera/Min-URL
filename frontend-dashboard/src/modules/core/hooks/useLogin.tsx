import { useEffect } from 'react'
import { create } from 'zustand'
import axios from 'axios'
import { VITE_VERIFY_AUTH_TOKEN_LINK, VITE_LOGOUT_LINK } from '@/constants'
import { useNavigate } from 'react-router'
import type { Language } from '@/types'

type UserType = {
	name: string
}

type LoginStore = {
	user: UserType | null
	isLoggedIn: boolean
	isLoading: boolean
	setUser: (user: UserType) => void
	logout: () => Promise<void>
}

export const useLoginStore = create<LoginStore>((set) => ({
	user: null,
	isLoading: true,
	isLoggedIn: false,
	setUser: (user: UserType) =>
		set({ user, isLoggedIn: true, isLoading: false }),
	logout: async () => {
		try {
			await axios.post(
				VITE_LOGOUT_LINK,
				{},
				{
					withCredentials: true,
				},
			)
			set({ user: null, isLoggedIn: false, isLoading: false })
		} catch {
			set({ user: null, isLoggedIn: false, isLoading: false })
		}
	},
}))

export const useLogin = (lang: Language) => {
	const { user, isLoggedIn, isLoading, setUser, logout } = useLoginStore()

	const navigate = useNavigate()

	// Se verifica si el usuario está autenticado
	// Si está autenticado, se redirecciona al dashboard
	// Si no está autenticado, se redirecciona al login
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await axios.get(VITE_VERIFY_AUTH_TOKEN_LINK, {
					withCredentials: true,
				})
				setUser({
					name: response.data.username,
				})
				navigate('/dashboard')
			} catch {
				logout()
				navigate(`/${lang}/login`)
			}
		}
		checkAuth()
	}, [])
	return { user, isLoggedIn, isLoading }
}

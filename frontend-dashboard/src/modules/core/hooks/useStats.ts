import { useEffect } from 'react'
import { useStatsStore } from '@/stores/statsStore.ts'
import { axiosInstance } from '../lib/axios.ts'
import { useAuthStore } from '@/stores/authStore.ts'
import { useState } from 'react'
import type { Socket } from 'socket.io-client'

export const useStats = () => {
	const { basicStats, setStats } = useStatsStore()
	const { isAuthenticated, setAuthenticated } = useAuthStore()
	const [isLoading, setIsLoading] = useState(true)
	const [socket, setSocket] = useState<Socket>()

	useEffect(() => {
		let mounted = true
		setIsLoading(true)

		const controller = new AbortController()
		//Llamamos a la API
		const getStats = async () => {
			try {
				const response = await axiosInstance.get('/protected/dashboard-stats', {
					signal: controller.signal,
				})

				if (mounted) {
					setStats(
						response.data.basicStats,
						response.data.countryStats,
						response.data.deviceStats,
						response.data.topLinks,
						response.data.topQrCodes,
						false,
					)
					//Conectamos al socket con el token que nos devuelve el servidor
					const token = response.data.user.accessToken

					setAuthenticated(true, response.data.user)
					setIsLoading(false)
				}
			} catch {
				setIsLoading(false)
			}
		}

		//Si ya hay datos, no llamamos a la API
		if (basicStats) {
			setIsLoading(false)
			return
		}

		getStats()

		return () => {
			mounted = false
			controller.abort()
			setIsLoading(false)
		}
	}, [setStats, setAuthenticated, basicStats])

	return { isAuthenticated, isLoading }
}

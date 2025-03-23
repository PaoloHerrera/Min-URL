import { useEffect } from 'react'
import { useStatsStore } from '@/stores/statsStore.ts'
import { axiosInstance } from '../lib/axios.ts'
import { useAuthStore } from '@/stores/authStore.ts'
import { useState } from 'react'

export const useStats = () => {
	const { shortUrls, setStats } = useStatsStore()
	const { isAuthenticated, setAuthenticated } = useAuthStore()
	const [isLoading, setIsLoading] = useState(true)

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
						response.data.clickPerformance,
						response.data.shortUrls,
						false,
					)
					setAuthenticated(true, response.data.user)
					setIsLoading(false)
				}
			} catch {
				setIsLoading(false)
			}
		}

		//Si ya hay datos, no llamamos a la API
		if (shortUrls) {
			setIsLoading(false)
			return
		}

		getStats()

		return () => {
			mounted = false
			controller.abort()
			setIsLoading(false)
		}
	}, [setStats, setAuthenticated, shortUrls])

	return { shortUrls, isAuthenticated, isLoading }
}

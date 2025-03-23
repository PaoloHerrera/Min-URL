import { useState, useEffect } from 'react'
import { axiosInstance } from '../../core/lib/axios.ts'
import { translations } from '../../core/i18n/index.ts'
import { useLanguageStore } from '@/stores/languageStore.ts'

export const useCheckSlug = ({ slug }: { slug: string }) => {
	const [isAvailable, setIsAvailable] = useState({
		message: '',
		isAvailable: false,
	})
	const [loading, setLoading] = useState(false)
	const { language } = useLanguageStore()
	const { error } =
		translations[language].dashboard.navbar.dialogNewLink.customSlug

	useEffect(() => {
		const fetchSlugAvailability = async (slug: string) => {
			try {
				setLoading(true)
				const result = await axiosInstance.post('/protected/check-slug', {
					slug,
				})
				setIsAvailable({
					message: result.data.message || '',
					isAvailable: result.data.isAvailable,
				})
			} catch (err: unknown) {
				if (
					err &&
					typeof err === 'object' &&
					'response' in err &&
					err.response &&
					typeof err.response === 'object' &&
					'data' in err.response
				) {
					const errorCode = (err.response as { data: { message: string } }).data
						.message
					setIsAvailable({
						message: error[errorCode as keyof typeof error],
						isAvailable: false,
					})
				}
			} finally {
				setLoading(false)
			}
		}

		if (slug && slug.length >= 6 && slug.length <= 12) {
			fetchSlugAvailability(slug)
		}
	}, [slug, error])

	return {
		isAvailable,
		loading,
		setIsAvailable,
	}
}

import { useState, useEffect } from 'react'
import { axiosInstance } from '../../core/lib/axios.ts'
import { translations } from '../../core/i18n/index.ts'
import { useLanguageStore } from '@/stores/languageStore.ts'
import { AxiosError } from 'axios'

const ERRORS = {
	429: 'tooManyRequests',
	409: 'alreadyInUse',
	generic: 'generic',
}

interface CheckSlugResponse {
	isAvailable: boolean
	error: string | null
}

export const useCheckSlug = ({ slug }: { slug: string }) => {
	const [checkSlugStatus, setCheckSlugStatus] = useState<CheckSlugResponse>({
		isAvailable: false,
		error: null,
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
				setCheckSlugStatus({
					isAvailable: result.data.isAvailable,
					error: null,
				})
			} catch (err) {
				//Status code
				if (err instanceof AxiosError) {
					const status = err.response?.status ?? 'generic'

					const typeError = ERRORS[status as keyof typeof ERRORS]
					setCheckSlugStatus({
						isAvailable: false,
						error: error[typeError as keyof typeof error],
					})
					return
				}
				//Default error
				setCheckSlugStatus({
					isAvailable: false,
					error: error.generic,
				})
			} finally {
				setLoading(false)
			}
		}
		if (slug && slug.length >= 6 && slug.length <= 12) {
			fetchSlugAvailability(slug)
		}
	}, [slug, error])

	return {
		checkSlugStatus,
		loading,
		setCheckSlugStatus,
	}
}

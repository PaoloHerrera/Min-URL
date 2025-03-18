import { useState, useEffect } from 'react'
import { axiosInstance } from '../lib/axios.ts'
import { translations } from '../i18n/index.ts'
import { useLanguageStore } from '../stores/languageStore.ts'

const MIN_LENGTH = 6
const MAX_LENGTH = 12

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
		const checkSlug = async (slug: string) => {
			if (!slug) {
				return
			}

			// Check if slug is valid
			if (slug.length < MIN_LENGTH) {
				setIsAvailable({
					message: error.minLength,
					isAvailable: false,
				})
				return
			}
			if (slug.length > MAX_LENGTH) {
				setIsAvailable({
					message: error.maxLength,
					isAvailable: false,
				})
				return
			}

			setLoading(true)

			try {
				const result = await axiosInstance.post('/protected/check-slug', {
					slug,
				})
				setIsAvailable({
					message: result.data.message || '',
					isAvailable: result.data.isAvailable,
				})
			} catch {
				throw new Error('Error. Slug check failed, please try again.')
			} finally {
				setLoading(false)
			}
		}

		checkSlug(slug)
	}, [slug, error])

	return {
		isAvailable,
		loading,
		setIsAvailable,
	}
}

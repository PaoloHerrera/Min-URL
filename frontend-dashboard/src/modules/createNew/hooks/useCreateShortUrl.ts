import { useNewShortUrlStore } from '@/stores/newShortUrlStore'
import { createShortUrl } from '@/modules/core/services/api'
import { useTranslations } from '@/modules/core/hooks/useTranslations'

export const useCreateShortUrl = () => {
	const { setNewShortUrl, serverError, setServerError } = useNewShortUrlStore()

	const { dashboard } = useTranslations()
	const { submitError } = dashboard.navbar.dialogNewLink

	const handleSubmit = async (
		data: { title: string; url: string; customSlug: boolean; slug?: string },
		onSuccess: () => Promise<void>,
	) => {
		try {
			const response = await createShortUrl(data)

			await onSuccess()
			setNewShortUrl({
				url: response.originalUrl,
				shortUrl: response.shortUrl,
				slug: response.slug,
				createdAt: response.createdAt,
			})
		} catch (_err) {
			setServerError(submitError)
		}
	}

	return {
		handleSubmit,
		serverError,
	}
}

import { useNewShortUrlStore } from '@/stores/newShortUrlStore'
import { createShortUrl } from '@/modules/core/services/api'

export const useCreateShortUrl = () => {
	const { setNewShortUrl } = useNewShortUrlStore()

	const handleSubmit = async (
		data: { url: string; customSlug: boolean; slug?: string },
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
		} catch (err) {
			console.log('Error al crear un nuevo enlace corto', err)
		}
	}

	return {
		handleSubmit,
	}
}

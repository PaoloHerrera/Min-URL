import { createQrCode } from '@/modules/core/services/api'
import { useTranslations } from '@/modules/core/hooks/useTranslations.ts'
import { useNewQrCodeStore } from '@/stores/newQrCodeStore'

export const useCreateQrCode = () => {
	const { dashboard } = useTranslations()
	const { submitError } = dashboard.navbar.dialogNewQr
	const { serverError, setServerError, setNewQrCode } = useNewQrCodeStore()

	const handleSubmit = async (
		data: {
			title: string
			url: string
			foregroundColor: string
			backgroundColor: string
		},
		onSuccess: () => Promise<void>,
	) => {
		try {
			const response = await createQrCode(data)
			await onSuccess()

			setNewQrCode({
				title: response.title,
				url: response.originalUrl,
				shortUrl: response.shortUrl,
				slug: response.slug,
				createdAt: response.createdAt,
				foregroundColor: response.foregroundColor,
				backgroundColor: response.backgroundColor,
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

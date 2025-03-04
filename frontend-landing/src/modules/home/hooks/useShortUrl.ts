import { validateUrl } from '@/modules/core/utils/utils.ts'
import {
	shortUrlReducer,
	initialState,
	ActionType,
} from '@/modules/core/reducers/shortUrlReducer.ts'
import { useTranslation } from '@/modules/core/hooks/useTranslation.ts'
import { useReducer } from 'react'
import { useRecaptcha } from '@/modules/home/hooks/useRecaptcha.ts'
import { anonFetchUrl } from '@/modules/home/services/anonFetchUrl.ts'
import { SHORT_URL_DIRECT } from '@/modules/core/utils/constants.ts'
import { addProtocolIfNeeded } from '@/modules/core/utils/utils.ts'

export const useShortUrl = () => {
	const { t } = useTranslation()
	const { error } = t('hero')
	const [state, dispatch] = useReducer(shortUrlReducer, initialState)
	const { loadScript, generateToken } = useRecaptcha()

	const handleUrlChange = (url: string) => {
		const formattedUrl = addProtocolIfNeeded(url)
		const isValid = validateUrl(formattedUrl)

		dispatch({ type: ActionType.SetLongUrl, payload: formattedUrl })

		if (isValid) {
			dispatch({
				type: ActionType.SetError,
				payload: { type: '', message: '' },
			})
		} else {
			dispatch({
				type: ActionType.SetError,
				payload: {
					type: 'invalidUrl',
					message: error.invalidUrl,
				},
			})
		}
	}

	const shortenUrl = async () => {
		if (!validateUrl(state.longUrl)) {
			dispatch({
				type: ActionType.SetError,
				payload: {
					type: 'invalidUrl',
					message: error.invalidUrl,
				},
			})
			return
		}

		dispatch({ type: ActionType.SetIsLoading, payload: true })

		try {
			await loadScript()
			const token = await generateToken()

			const response = await anonFetchUrl({
				url: state.longUrl,
				apiUrl: SHORT_URL_DIRECT,
				recaptchaToken: token,
			})

			dispatch({
				type: ActionType.SetShortUrl,
				payload: response.data.shortUrl,
			})
			dispatch({ type: ActionType.SetPurpose, payload: response.data.purpose })
			dispatch({
				type: ActionType.SetCreatedAt,
				payload: response.data.createdAt,
			})
		} catch {
			dispatch({
				type: ActionType.SetError,
				payload: {
					type: 'serverError',
					message: error.defaultError,
				},
			})
		} finally {
			dispatch({ type: ActionType.SetIsLoading, payload: false })
		}
	}

	return { state, handleUrlChange, shortenUrl }
}

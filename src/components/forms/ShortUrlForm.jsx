import { Form } from '@heroui/react'
import { useUrl } from '@hooks/useUrl'
import { useShortUrl } from '@hooks/useShortUrl'
import { useRecaptcha } from '@hooks/useRecaptcha'
import { useCallback } from 'react'
import debounce from 'just-debounce-it'
import InputUrl from '@components/InputUrl'
import SubmitButton from '@components/SubmitButton'
import ErrorMessage from '@components/ErrorMessage'
import { RECAPTCHA_SITE_KEY } from '../../constants'

export function ShortUrlForm() {
	const { url, setInvalid } = useUrl()
	const { getShortUrl } = useShortUrl()
	const { isLoaded, loadRecaptcha } = useRecaptcha(RECAPTCHA_SITE_KEY)

	const debouncedGetShortUrl = useCallback(
		debounce((url) => {
			getShortUrl({ url })
		}, 300),
		[],
	)

	const handleSubmit = async (e) => {
		e.preventDefault()
		const isValid = !setInvalid(url)
		if (!isValid) return

		if (!isLoaded) {
			await loadRecaptcha()
			debouncedGetShortUrl(url)
		} else {
			debouncedGetShortUrl(url)
		}
	}

	return (
		<Form
			onSubmit={handleSubmit}
			className="w-full max-w-full flex items-center mt-10 gap-5 flex-col"
		>
			<p className="text-left sm:text-2xl text-md">
				Free URL shortener with QR code. Just paste your link below!
			</p>

			<div className="w-full mt-5">
				<InputUrl />
			</div>

			<SubmitButton />

			<ErrorMessage />
		</Form>
	)
}

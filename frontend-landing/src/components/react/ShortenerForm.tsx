import { useDebounceValidation } from '@/hooks/useDebounceValidation'
import { useShortener } from '@/hooks/useShortener'
import { useTurnstile } from '@/hooks/useTurnstile'
import { validateUrl } from '@/lib/utils'
import { useState } from 'react'
import type React from 'react'

interface TextContextProps {
	buttonText: string
	loadingText: string
	errorUrlInvalidText: string
	errorShortenFailedText: string
	placeholderText: string
}

export const ShortenerForm = ({ texts }: { texts: TextContextProps }) => {
	const [longUrl, setLongUrl] = useState<string>('')
	const { isLoading, shortUrl, shorten, apiError, reset } = useShortener({
		errorShortenFailedText: texts.errorShortenFailedText,
	})
	const { debounceError, debounceValidate } = useDebounceValidation({
		errorUrlInvalidText: texts.errorUrlInvalidText,
	})
	const { turnstileToken, resetTurnstile } = useTurnstile({
		sitekey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '',
	})

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (turnstileToken) {
			shorten(longUrl, turnstileToken)
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target
		setLongUrl(value)
		debounceValidate(value)
	}

	const handleReset = () => {
		reset()
		setLongUrl('')
		resetTurnstile()
	}

	return (
		<>
			<div id="turnstile-container" />
			{!shortUrl && (
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						aria-label="longUrl"
						value={longUrl}
						onChange={handleChange}
						placeholder={texts.placeholderText}
					/>
					<button
						type="submit"
						disabled={!validateUrl(longUrl) || isLoading || !turnstileToken}
						aria-label="shorten"
						aria-busy={isLoading}
					>
						{isLoading ? texts.loadingText : texts.buttonText}
					</button>
				</form>
			)}

			{shortUrl && (
				<div data-testid="success-panel">
					<p aria-label="shortUrl">{shortUrl}</p>
					<button
						aria-label="copy"
						type="button"
						onClick={() => navigator.clipboard.writeText(shortUrl)}
					>
						Copy
					</button>
					<button onClick={handleReset} aria-label="reset" type="button">
						Reset
					</button>
				</div>
			)}

			{apiError && (
				<p style={{ color: 'red' }} aria-label="server-error-message">
					{apiError}
				</p>
			)}
			{debounceError && (
				<p style={{ color: 'red' }} aria-label="validation-error-message">
					{debounceError}
				</p>
			)}
		</>
	)
}

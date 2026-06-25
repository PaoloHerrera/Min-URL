import { useDebounceValidation } from '@/hooks/useDebounceValidation'
import { useShortener } from '@/hooks/useShortener'
import { validateUrl } from '@/lib/utils'
import { useState } from 'react'
import type React from 'react'

export const ShortenerForm = () => {
	const [longUrl, setLongUrl] = useState('')
	const { isLoading, shortUrl, shorten, apiError } = useShortener()
	const { debounceError, debounceValidate } = useDebounceValidation()

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()
		shorten(longUrl)
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target
		setLongUrl(value)
		debounceValidate(value)
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					aria-label="longUrl"
					value={longUrl}
					onChange={handleChange}
				/>
				<button
					type="submit"
					disabled={!validateUrl(longUrl) || isLoading}
					aria-label="shorten"
					aria-busy={isLoading}
				>
					{isLoading ? 'Shortening...' : 'Shorten'}
				</button>
			</form>
			{shortUrl && <p aria-label="shortUrl">{shortUrl}</p>}
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

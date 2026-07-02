import { useDebounceValidation } from '@/hooks/useDebounceValidation.ts'
import { useShortener } from '@/hooks/useShortener.ts'
import { useTurnstile } from '@/hooks/useTurnstile.ts'
import confetti from 'canvas-confetti'
import { AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import type React from 'react'
import { AlertMessage } from './AlertMessage.tsx'
import { ShortenerInput } from './ShortenerInput.tsx'
import { ShortenerSuccess } from './ShortenerSuccess.tsx'

interface TextContextProps {
	buttonText: string
	loadingText: string
	errorUrlInvalidText: string
	errorShortenFailedText: string
	placeholderText: string
	successTitleText: string
	copiedText: string
	copyText: string
	visitText: string
	resetText: string
	successSubtitleText: string
}

export const ShortenerForm = ({ texts }: { texts: TextContextProps }) => {
	const [longUrl, setLongUrl] = useState<string>('')
	const [isCopied, setIsCopied] = useState<boolean>(false)
	const { isLoading, shortUrl, shorten, apiError, reset } = useShortener({
		errorShortenFailedText: texts.errorShortenFailedText,
	})
	const { debounceError, debounceValidate } = useDebounceValidation({
		errorUrlInvalidText: texts.errorUrlInvalidText,
	})
	const { turnstileToken, resetTurnstile } = useTurnstile({
		sitekey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '',
	})

	// 🎉 Fire confetti when a short URL is obtained
	useEffect(() => {
		if (!shortUrl) {
			return
		}
		confetti({
			particleCount: 90,
			spread: 75,
			origin: { y: 0.52 },
			colors: ['#0056ff', '#5b21b6', '#4d81ff', '#a78bfa', '#ffffff'],
			scalar: 0.85,
			ticks: 220,
			disableForReducedMotion: true,
		})
	}, [shortUrl])

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

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(shortUrl)
			setIsCopied(true)
			setTimeout(() => setIsCopied(false), 2000)
		} catch (_err) {
			// Clipboard copy failure (ignored)
		}
	}

	const handleReset = () => {
		reset()
		setLongUrl('')
		setIsCopied(false)
		resetTurnstile()
	}

	return (
		<div className="w-full space-y-4">
			<div id="turnstile-container" />

			{/* ── URL Input Form ─────────────────────────────────────────── */}
			{!shortUrl && (
				<ShortenerInput
					longUrl={longUrl}
					onChange={handleChange}
					onSubmit={handleSubmit}
					isLoading={isLoading}
					debounceError={debounceError}
					turnstileToken={turnstileToken}
					texts={texts}
				/>
			)}

			{/* ── Success Card ─────────────────────────────────────────────── */}
			<AnimatePresence>
				{shortUrl && (
					<ShortenerSuccess
						shortUrl={shortUrl}
						isCopied={isCopied}
						onCopy={handleCopy}
						onReset={handleReset}
						texts={texts}
					/>
				)}
			</AnimatePresence>

			{/* ── Error Alerts — DaisyUI `alert` component ───────────────── */}
			{apiError && (
				<AlertMessage
					message={apiError}
					type="error"
					ariaLabel="server-error-message"
				/>
			)}

			{debounceError && (
				<AlertMessage
					message={debounceError}
					type="error"
					ariaLabel="validation-error-message"
				/>
			)}
		</div>
	)
}

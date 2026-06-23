import axios from 'axios'
import { type SubmitEvent, useState } from 'react'
import type { Translations } from '../../i18n/types.ts'

//TODO: Refactorizar y validar correctamente. De ser necesario utilizar zod.

interface ShortenerFormProps {
	apiUrl: string
	recaptchaKey: string
	texts: Translations['hero']['shortener']
}

interface CustomWindow extends Window {
	grecaptcha?: {
		ready: (callback: () => void) => void
		execute: (siteKey: string, options: { action: string }) => Promise<string>
	}
}

const PROTOCOL_REGEX = /^https?:\/\//i

export const ShortenerForm = ({
	apiUrl,
	recaptchaKey,
	texts,
}: ShortenerFormProps) => {
	const [longUrl, setLongUrl] = useState('')
	const [shortUrl, setShortUrl] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState({ active: false, message: '' })
	const [isSuccessCopy, setIsSuccessCopy] = useState(false)

	const addProtocolIfNeeded = (url: string): string => {
		if (!PROTOCOL_REGEX.test(url)) {
			return `https://${url}`
		}
		return url
	}

	const validateUrl = (url: string): boolean => {
		try {
			const parsed = new URL(url)
			return parsed.protocol === 'http:' || parsed.protocol === 'https:'
		} catch {
			return false
		}
	}

	const loadRecaptchaScript = async (siteKey: string): Promise<void> => {
		const customWindow = window as unknown as CustomWindow
		if (customWindow.grecaptcha) {
			return
		}
		return new Promise((resolve, reject) => {
			const script = document.createElement('script')
			script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
			script.async = true
			script.defer = true
			script.onload = () => resolve()
			script.onerror = () =>
				reject(new Error('No se pudo cargar Google reCAPTCHA'))
			document.head.appendChild(script)
		})
	}

	const generateRecaptchaToken = async (siteKey: string): Promise<string> => {
		return new Promise((resolve, reject) => {
			const customWindow = window as unknown as CustomWindow
			const grecaptcha = customWindow.grecaptcha
			if (!grecaptcha) {
				reject(new Error('reCAPTCHA no está inicializado'))
				return
			}
			grecaptcha.ready(() => {
				grecaptcha
					.execute(siteKey, { action: 'submit' })
					.then((token: string) => resolve(token))
					.catch(reject)
			})
		})
	}

	const handleUrlChange = (val: string) => {
		setLongUrl(val)
		if (error.active) {
			setError({ active: false, message: '' })
		}
	}

	const performShorten = async (formattedUrl: string) => {
		try {
			await loadRecaptchaScript(recaptchaKey)
			const token = await generateRecaptchaToken(recaptchaKey)

			const response = await axios.post(apiUrl, {
				originalUrl: formattedUrl,
				recaptchaToken: token,
			})

			if (response.data?.shortUrl) {
				setShortUrl(response.data.shortUrl)
			} else {
				throw new Error(texts.errorInvalid)
			}
		} catch (err: unknown) {
			let msg = texts.errorInvalid
			if (axios.isAxiosError(err)) {
				msg = err.response?.data?.message || err.message
			} else if (err instanceof Error) {
				msg = err.message
			}
			setError({ active: true, message: msg })
		} finally {
			setIsLoading(false)
		}
	}

	const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formatted = addProtocolIfNeeded(longUrl.trim())

		if (!validateUrl(formatted)) {
			setError({ active: true, message: texts.errorInvalid })
			return
		}

		setIsLoading(true)
		setError({ active: false, message: '' })
		await performShorten(formatted)
	}

	const copyToClipboard = () => {
		if (!shortUrl) {
			return
		}
		navigator.clipboard.writeText(shortUrl)
		setIsSuccessCopy(true)
		setTimeout(() => setIsSuccessCopy(false), 2000)
	}

	return (
		<div className="w-full flex flex-col gap-6">
			{/* Input Form */}
			<form onSubmit={handleSubmit} className="w-full">
				<div className="relative flex flex-col sm:flex-row items-stretch gap-3">
					<div className="relative grow">
						{/* Inline SVG Link Icon */}
						<div className="absolute inset-y-0 left-4 flex items-center pointer-events-none tool-input-icon z-99">
							<svg
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
								/>
							</svg>
						</div>
						<input
							data-testid="url-input"
							type="text"
							value={longUrl}
							onChange={(e) => handleUrlChange(e.target.value)}
							placeholder={texts.placeholder}
							disabled={isLoading}
							className="tool-input"
							aria-label={texts.placeholder}
							aria-describedby={error.active ? 'shortener-error' : undefined}
						/>
					</div>
					<button
						data-testid="shorten-submit"
						type="submit"
						disabled={isLoading || !longUrl.trim()}
						aria-busy={isLoading}
						aria-label={isLoading ? texts.loading : texts.button}
						className="tool-btn-submit"
					>
						{isLoading ? (
							<>
								{/* Spinner SVG */}
								<svg
									className="animate-spin h-5 w-5 text-white"
									fill="none"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									/>
								</svg>
								<span>{texts.loading}</span>
							</>
						) : (
							<span>{texts.button}</span>
						)}
					</button>
				</div>
				{error.active && (
					<p
						data-testid="shortener-error"
						role="alert"
						className="mt-2 text-sm text-red-400 font-medium flex items-center gap-1.5 pl-1"
					>
						<svg
							className="h-4.5 w-4.5 shrink-0"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2.2"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
						{error.message}
					</p>
				)}
			</form>

			{/* Success Card Result */}
			{shortUrl && (
				<div
					data-testid="success-panel"
					className="w-full glass-panel rounded-2xl p-6 shadow-xl border border-white/8 flex flex-col md:flex-row items-center gap-6 animate-[fadeIn_0.4s_ease-out]"
				>
					{/* Text Side */}
					<div className="grow w-full flex flex-col gap-4">
						<div>
							<h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
								{texts.successTitle}
							</h3>
							<p
								data-testid="short-url-display"
								className="mt-1.5 text-2xl font-bold tracking-tight text-primary-electric-blue select-all overflow-x-auto whitespace-nowrap pb-1 scrollbar-thin"
							>
								{shortUrl}
							</p>
						</div>

						<div className="flex flex-wrap gap-3">
							{/* Copy Button */}
							<button
								type="button"
								onClick={copyToClipboard}
								aria-label={isSuccessCopy ? texts.copied : texts.copy}
								className={`tool-btn-ghost cursor-pointer ${
									isSuccessCopy
										? 'bg-emerald-500/10! text-emerald-400! border-emerald-500/25!'
										: ''
								}`}
							>
								{isSuccessCopy ? (
									<>
										<svg
											className="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth="2.5"
											aria-hidden="true"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M5 13l4 4L19 7"
											/>
										</svg>
										<span>{texts.copied}</span>
									</>
								) : (
									<>
										<svg
											className="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth="2"
											aria-hidden="true"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
											/>
										</svg>
										<span>{texts.copy}</span>
									</>
								)}
							</button>

							{/* Open Link Button */}
							<a
								href={shortUrl}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={`${texts.visit} ${shortUrl}`}
								className="tool-btn-ghost"
							>
								<svg
									className="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth="2"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
									/>
								</svg>
								<span>{texts.visit}</span>
							</a>
						</div>
					</div>

					{/* Divider */}
					<div className="h-px w-full md:h-24 md:w-px bg-white/8" />
				</div>
			)}
		</div>
	)
}

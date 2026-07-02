import { validateUrl } from '@/lib/utils'
import type React from 'react'

interface ShortenerInputProps {
	longUrl: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void
	isLoading: boolean
	debounceError: string | null
	turnstileToken: string | null
	texts: {
		buttonText: string
		loadingText: string
		placeholderText: string
	}
}

export const ShortenerInput = ({
	longUrl,
	onChange,
	onSubmit,
	isLoading,
	debounceError,
	turnstileToken,
	texts,
}: ShortenerInputProps) => {
	const isUrlValid = validateUrl(longUrl)

	return (
		<form onSubmit={onSubmit} className="w-full">
			<div className="flex flex-col sm:flex-row gap-3 w-full items-stretch">
				{/* DaisyUI `input` with conditional state classes */}
				<label
					className={`input input-lg w-full flex items-center gap-2 rounded-xl border transition-all duration-200 ${
						debounceError
							? 'input-error'
							: isUrlValid
								? 'input-success'
								: 'border-white/10 focus-within:border-brand-500/60 focus-within:shadow-[0_0_0_3px_rgba(0,86,255,0.15)]'
					}`}
				>
					<svg
						className="size-5 shrink-0 opacity-50"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="2"
						aria-hidden="true"
					>
						<title>Link icon</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
						/>
					</svg>
					<input
						type="text"
						aria-label="longUrl"
						value={longUrl}
						onChange={onChange}
						placeholder={texts.placeholderText}
						className="grow bg-transparent border-none outline-none focus:ring-0"
					/>
				</label>

				{/* Submit — uses the global `.btn-cta` semantic class */}
				<button
					type="submit"
					className="btn btn-cta btn-lg rounded-xl px-8 shrink-0 cursor-pointer"
					disabled={!isUrlValid || isLoading || !turnstileToken}
					aria-label="shorten"
					aria-busy={isLoading}
				>
					{isLoading && <span className="loading loading-spinner loading-sm" />}
					{isLoading ? texts.loadingText : texts.buttonText}
				</button>
			</div>
		</form>
	)
}

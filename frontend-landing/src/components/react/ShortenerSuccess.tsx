import { motion } from 'motion/react'

interface ShortenerSuccessProps {
	shortUrl: string
	isCopied: boolean
	onCopy: () => void
	onReset: () => void
	texts: {
		successTitleText: string
		successSubtitleText: string
		copyText: string
		copiedText: string
		visitText: string
		resetText: string
	}
}

export const ShortenerSuccess = ({
	shortUrl,
	isCopied,
	onCopy,
	onReset,
	texts,
}: ShortenerSuccessProps) => {
	return (
		<motion.div
			data-testid="success-panel"
			className="success-card rounded-2xl overflow-hidden"
			initial={{ opacity: 0, y: 16, scale: 0.96 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, y: -8, scale: 0.97 }}
			transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
		>
			{/* ── Header: big icon + ping ring + title ──────────────────── */}
			<div className="flex flex-col items-center gap-4 pt-6 pb-2">
				<div className="relative flex items-center justify-center">
					{/* Ping ring */}
					<div className="absolute size-16 rounded-full bg-success/25 animate-ping-slow" />
					{/* Icon badge */}
					<div className="relative bg-success/15 text-success rounded-full size-14 flex items-center justify-center ring-2 ring-success/30">
						<svg
							className="size-7"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2.5"
							aria-hidden="true"
						>
							<title>Success check</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
				</div>
				<div className="text-center">
					<h3 className="text-xl font-bold text-base-content">
						{texts.successTitleText}
					</h3>
					<p className="text-xs text-base-content/40 mt-1 tracking-wide uppercase font-medium">
						{texts.successSubtitleText}
					</p>
				</div>
			</div>

			{/* ── URL + action buttons ───────────────────────────────────── */}
			<div className="flex flex-col sm:flex-row items-stretch gap-2 px-5">
				{/* Brand-tinted URL box */}
				<div className="flex-1 font-mono text-sm bg-brand-500/6 border border-brand-500/20 rounded-xl px-4 py-3 flex items-center min-w-0 overflow-hidden">
					<p className="truncate font-semibold" aria-label="shortUrl">
						{shortUrl}
					</p>
				</div>

				<div className="flex gap-2 shrink-0">
					{/* Copy — primary action for copy */}
					<button
						className={`btn rounded-xl flex-1 sm:flex-none gap-1.5 cursor-pointer transition-all duration-200 font-semibold ${
							isCopied ? 'btn-success text-white!' : 'btn-copy'
						}`}
						onClick={onCopy}
						aria-label="copy"
						type="button"
					>
						{isCopied ? (
							<svg
								className="size-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="3"
								aria-hidden="true"
							>
								<title>Copied</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						) : (
							<svg
								className="size-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
								aria-hidden="true"
							>
								<title>Copy link</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
								/>
							</svg>
						)}
						<span>{isCopied ? texts.copiedText : texts.copyText}</span>
					</button>

					{/* Visit — secondary */}
					<a
						href={shortUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="btn btn-outline rounded-xl flex-1 sm:flex-none gap-1.5 cursor-pointer border-base-content/20 hover:border-base-content/40"
					>
						<svg
							className="size-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
							aria-hidden="true"
						>
							<title>Visit link</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
							/>
						</svg>
						<span>{texts.visitText}</span>
					</a>
				</div>
			</div>

			{/* ── Reset CTA ─────────────────────────────────────────────── */}
			<div className="px-5 pb-5 pt-3 border-t border-brand-500/10">
				<button
					onClick={onReset}
					className="btn btn-lg rounded-xl cursor-pointer font-semibold w-full gap-4 btn-cta"
					aria-label="reset"
					type="button"
				>
					<span>{texts.resetText}</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="2.5"
						stroke="currentColor"
						className="size-5 animate-slide-right"
						aria-hidden="true"
					>
						<title>Arrow right</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
						/>
					</svg>
				</button>
			</div>
		</motion.div>
	)
}

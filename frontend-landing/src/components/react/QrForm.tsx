import { useState } from 'react'
// biome-ignore lint/style/useNamingConvention: QRCode library required
import QRCode from 'react-qr-code'

//TODO: Refactorizar y validar correctamente. De ser necesario utilizar zod.

interface QrFormProps {
	placeholder: string
	button: string
	downloadQr: string
	errorInvalid: string
}

const PROTOCOL_REGEX = /^https?:\/\//i

export const QrForm = ({
	placeholder,
	button,
	downloadQr,
	errorInvalid,
}: QrFormProps) => {
	const [url, setUrl] = useState('')
	const [qrValue, setQrValue] = useState('')
	const [error, setError] = useState('')

	const handleGenerate = () => {
		const trimmed = url.trim()
		if (!trimmed) {
			setError(errorInvalid)
			return
		}
		const full = PROTOCOL_REGEX.test(trimmed) ? trimmed : `https://${trimmed}`
		try {
			new URL(full)
			setQrValue(full)
			setError('')
		} catch {
			setError(errorInvalid)
		}
	}

	const downloadQrCode = () => {
		const svg = document.getElementById('qr-anon-svg') as SVGSVGElement | null
		if (!svg) {
			return
		}
		const svgData = new XMLSerializer().serializeToString(svg)
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')
		const img = new Image()
		img.onload = () => {
			canvas.width = 256
			canvas.height = 256
			ctx?.drawImage(img, 0, 0, 256, 256)
			const link = document.createElement('a')
			link.download = 'min-url-qr.png'
			link.href = canvas.toDataURL('image/png')
			link.click()
		}
		img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`
	}

	return (
		<div className="w-full flex flex-col gap-5">
			{/* Input row */}
			<div className="flex flex-col sm:flex-row items-stretch gap-3">
				<div className="relative grow">
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
								d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
							/>
						</svg>
					</div>
					<input
						type="text"
						value={url}
						onChange={(e) => {
							setUrl(e.target.value)
							setError('')
						}}
						onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
						placeholder={placeholder}
						aria-label={placeholder}
						aria-describedby={error ? 'qr-error' : undefined}
						className="tool-input"
					/>
				</div>
				<button
					type="button"
					onClick={handleGenerate}
					disabled={!url.trim()}
					aria-label={button}
					className="tool-btn-submit"
				>
					{button}
				</button>
			</div>

			{error && (
				<p
					id="qr-error"
					role="alert"
					className="text-sm text-red-400 font-medium flex items-center gap-1.5 pl-1"
				>
					<svg
						className="h-4 w-4 shrink-0"
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
					{error}
				</p>
			)}

			{/* QR Result */}
			{qrValue && (
				<div className="flex flex-col items-center gap-4 animate-[fadeIn_0.4s_ease-out]">
					<div className="p-4 bg-white rounded-2xl shadow-xl">
						<QRCode
							id="qr-anon-svg"
							value={qrValue}
							size={160}
							style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
							viewBox="0 0 256 256"
						/>
					</div>
					<button
						type="button"
						onClick={downloadQrCode}
						aria-label={downloadQr}
						className="tool-btn-ghost"
					>
						<svg
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2.2"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
							/>
						</svg>
						{downloadQr}
					</button>
				</div>
			)}
		</div>
	)
}

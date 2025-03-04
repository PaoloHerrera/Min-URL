export const handleUrlErrors = (err, _req, res, _next) => {
	console.error(`URL Error: ${err.message}`)
	const status = err instanceof URIError ? 400 : 500
	res.status(status).json({ message: 'URL processing error' })
}

export const handleQrCodeErrors = (err, _req, res, _next) => {
	console.error(`QR Code Error: ${err.message}`)
	const status = err instanceof URIError ? 400 : 500
	res.status(status).json({ message: 'QR Code processing error' })
}

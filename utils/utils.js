const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const PROTOCOL_REGEX = /^https?:\/\//i

export const addHttpScheme = (url) => {
	if (!PROTOCOL_REGEX.test(url)) {
		return `http://${url}`
	}
	return url
}

const base64ToBytes = (base64) => {
	return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
}

function bytesToBase62(bytes) {
	let num = BigInt(0)
	for (const byte of bytes) {
		num = (num << BigInt(8)) + BigInt(byte)
	}
	let result = ''
	while (num > 0) {
		const remainder = num % BigInt(62)
		result = BASE62[Number(remainder)] + result
		num /= BigInt(62)
	}
	return result || '0'
}

export const base64ToBase62 = (base64) => {
	const bytes = base64ToBytes(base64)
	return bytesToBase62(bytes)
}

export const handleAsyncError = (fn) => async (req, res, next) => {
	try {
		await fn(req, res, next)
	} catch (error) {
		next(error)
	}
}

export const generateHash = (input, crypto) => {
	return crypto.createHash('sha256').update(input).digest('base64')
}

import { createHash } from 'node:crypto'

const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const PROTOCOL_REGEX = /^https?:\/\//i

type UrlInput = string | undefined | null
type Base64Input = string | undefined | null
type BytesInput = Uint8Array | undefined | null
type InputCrypto = string

export const addHttpScheme = (url: UrlInput): string => {
	if (typeof url !== 'string') {
		return ''
	}

	if (!PROTOCOL_REGEX.test(url)) {
		return `http://${url}`
	}
	return url
}

const base64ToBytes = (base64: Base64Input): BytesInput => {
	if (typeof base64 !== 'string') {
		return undefined
	}
	return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
}

function bytesToBase62(bytes: BytesInput): string {
	if (!(bytes instanceof Uint8Array)) {
		return ''
	}
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

export const base64ToBase62 = (base64: Base64Input): string => {
	const bytes = base64ToBytes(base64)
	return bytesToBase62(bytes)
}

export const generateHash = (input: InputCrypto): string => {
	return createHash('sha256').update(input).digest('base64')
}

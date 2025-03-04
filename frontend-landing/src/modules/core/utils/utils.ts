import validator from 'validator'
const PROTOCOL_REGEX = /^https?:\/\//

export const addProtocolIfNeeded = (url: string): string => {
	if (!PROTOCOL_REGEX.test(url)) {
		return `https://${url}`
	}
	return url
}

export const validateUrl = (url: string) => {
	if (validator.isURL(url)) {
		return true
	}
	return false
}

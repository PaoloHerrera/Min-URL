import validator from 'validator'

export const validateUrl = (url: string) => {
	if (typeof url !== 'string') {
		return false
	}
	if (!validator.isURL(url)) {
		return false
	}
	return true
}

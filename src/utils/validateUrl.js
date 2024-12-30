import validator from 'validator'

export default function validateURL(url) {
	if (validator.isURL(url)) {
		return true
	}
	return false
}

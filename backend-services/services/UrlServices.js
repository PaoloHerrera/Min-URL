import { createUrl } from '../models/UrlModel.js'
import { validateUrl } from '../schema/url.js'

export const createValidatedUrl = async (data) => {
	const validation = validateUrl(data)

	if (!validation.success) {
		console.log(validation.error.message)
		throw new Error(validation.error.message)
	}

	return await createUrl(data)
}

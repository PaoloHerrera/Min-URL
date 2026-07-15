import { validateUrl } from '../schema/url.js'
import {
	createUrl,
	deleteUserUrl,
	updateUrl,
} from '../src/adapters/secondary/db/models/Url.model.js'

export const createValidatedUrl = async (data) => {
	const validation = validateUrl(data)
	if (!validation.success) {
		console.log(validation.error.message)
		throw new Error(validation.error.message)
	}

	return await createUrl(data)
}

export const deleteUrlbyUserId = async (userId, urlId) => {
	return await deleteUserUrl(userId, urlId)
}

export const updateUrlById = async (id, data) => {
	return await updateUrl(id, data)
}

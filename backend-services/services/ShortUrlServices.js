import { SHORTURL_VALUES } from '../constants.js'
import { createShortUrl, updateShortUrl } from '../models/shortUrlModel.js'
import { SlugGenerator } from '../services/slugGenerator.js'

export const createShortUrlForUrl = async ({ url, urlId }) => {
	// Se crea un slug aleatorio
	const generator = new SlugGenerator({
		initialLength: SHORTURL_VALUES.initialLength,
		maxAttempts: SHORTURL_VALUES.maxAttempts,
		maxLength: SHORTURL_VALUES.maxLength,
	})

	const slug = await generator.generateUniqueSlug(url)

	// Se crea la ShortUrl
	return await createShortUrl({
		url_id: urlId,
		slug,
	})
}

export const createShortUrlForUrlWithSlug = async ({ urlId, slug }) => {
	// Se crea la ShortUrl
	return await createShortUrl({
		url_id: urlId,
		slug,
	})
}

export const updateSlugForUrl = async ({ urlId, slug }) => {
	// Se actualiza el slug
	return await updateShortUrl({
		url_id: urlId,
		slug,
	})
}

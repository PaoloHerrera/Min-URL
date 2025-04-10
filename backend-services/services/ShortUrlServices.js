import { SlugGenerator } from '../services/SlugGenerator.js'
import { SHORTURL_VALUES } from '../constants.js'
import { createShortUrl } from '../models/ShortUrlModel.js'

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

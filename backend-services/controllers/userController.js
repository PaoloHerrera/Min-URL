import { REDIRECTOR_URL } from '../constants.js'
import {
	createShortUrlForUrl,
	createShortUrlForUrlWithSlug,
	updateSlugForUrl,
} from '../services/shortUrlServices.js'
import {
	createValidatedUrl,
	deleteUrlbyUserId,
	updateUrlById,
} from '../services/urlServices.js'
import { addShortUrlUsage } from '../src/adapters/secondary/db/models/User.model.js'

const createBaseUrl = async (req, purpose) => {
	const userId = req.body.userId
	let urlData = {}

	if (userId) {
		urlData = {
			user_id: userId,
			geolocations_id: req.geolocation.id_geolocations,
			title: req.body.title || 'Anonymous link',
			long_url: req.body.originalUrl,
			purpose,
		}
	} else {
		urlData = {
			geolocations_id: req.geolocation.id_geolocations,
			title: req.body.title || 'Anonymous link',
			long_url: req.body.originalUrl,
			purpose,
		}
	}
	return await createValidatedUrl(urlData)
}

export const createShortUrl = async (req, res) => {
	// Se valida la URL y se crea
	const url = await createBaseUrl(req, 'direct')

	/* Se crea una ShortUrl con el slug aleatorio */
	const shortUrl = await createShortUrlForUrl({
		url: url.long_url,
		urlId: url.id_urls,
	})

	/* Se incrementa el uso de Short URLs */
	await addShortUrlUsage(req.body.userId)

	res.json({
		originalUrl: req.body.originalUrl,
		shortUrl: `${REDIRECTOR_URL}/${shortUrl.slug}`,
		slug: shortUrl.slug,
		purpose: url.purpose,
		createdAt: url.created_at,
	})
}

export const createShortUrlAnonymous = async (req, res) => {
	// Se valida la URL y se crea
	const url = await createBaseUrl(req, 'direct')

	/* Se crea una ShortUrl con el slug aleatorio */
	const shortUrl = await createShortUrlForUrl({
		url: url.long_url,
		urlId: url.id_urls,
	})

	res.json({
		originalUrl: req.body.originalUrl,
		shortUrl: `${REDIRECTOR_URL}/${shortUrl.slug}`,
		slug: shortUrl.slug,
		purpose: url.purpose,
		createdAt: url.created_at,
	})
}

export const createShortUrlWithCustomSlug = async (req, res) => {
	// Se valida la URL y se crea
	const url = await createBaseUrl(req, 'direct')

	/* Se crea una ShortUrl con el slug personalizado */
	const shortUrl = await createShortUrlForUrlWithSlug({
		urlId: url.id_urls,
		slug: req.body.slug,
	})

	/* Se incrementa el uso de Short URLs */
	await addShortUrlUsage(req.body.userId)

	res.json({
		originalUrl: req.body.originalUrl,
		shortUrl: `${REDIRECTOR_URL}/${shortUrl.slug}`,
		slug: shortUrl.slug,
		purpose: url.purpose,
		createdAt: url.created_at,
	})
}

export const deleteUserUrl = async (req, res) => {
	const urlId = req.params.id
	const userId = req.body.userId
	await deleteUrlbyUserId(userId, urlId)
	res.json({})
}

export const updateUserUrl = async (req, res) => {
	const urlId = req.params.id
	const userId = req.body.userId
	const { title, originalUrl, slug } = req.body

	const urlData = {
		user_id: userId,
		title,
		long_url: originalUrl,
	}

	const url = await updateUrlById(urlId, urlData)

	if (slug) {
		await updateSlugForUrl({
			urlId: url.id_urls,
			slug,
		})
	}

	res.json({})
}

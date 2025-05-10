import {
	createValidatedUrl,
	deleteUrlbyUserId,
} from '../services/UrlServices.js'
import {
	createShortUrlForUrl,
	createShortUrlForUrlWithSlug,
} from '../services/ShorturlServices.js'
import { createQrForUrl } from '../services/QrServices.js'
import { REDIRECTOR_URL } from '../constants.js'
import { addShortUrlUsage, addQrCodeUsage } from '../models/UserModel.js'

const createBaseUrl = async (req, purpose) => {
	const urlData = {
		user_id: req.body.userId,
		geolocationsId: req.geolocation.id_geolocations,
		title: req.body.title,
		long_url: req.body.originalUrl,
		purpose,
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

export const createQrCode = async (req, res) => {
	// Se valida la URL y se crea
	const url = await createBaseUrl(req, 'qr')

	/* Se crea una ShortUrl con el slug aleatorio */
	const shortUrl = await createShortUrlForUrl({
		url: url.long_url,
		urlId: url.id_urls,
	})

	/* Se crea el código QR */
	const qrCode = await createQrForUrl({
		urlId: url.id_urls,
		foregroundColor: req.body.foregroundColor,
		backgroundColor: req.body.backgroundColor,
	})

	/* Se decrementa el uso de QR Codes */
	await addQrCodeUsage(req.body.userId)

	res.json({
		originalUrl: req.body.originalUrl,
		shortUrl: `${REDIRECTOR_URL}/${shortUrl.slug}`,
		slug: shortUrl.slug,
		foregroundColor: qrCode.foreground_color,
		backgroundColor: qrCode.background_color,
		createdAt: url.created_at,
	})
}

export const deleteUserUrl = async (req, res) => {
	const urlId = req.params.id
	const userId = req.body.userId
	await deleteUrlbyUserId(userId, urlId)
	res.json({})
}

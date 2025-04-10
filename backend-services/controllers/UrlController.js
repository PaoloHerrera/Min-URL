import { UrlModel } from '../models/UrlModel.js'
import { ShortUrlModel } from '../models/ShortUrlModel.js'
import { SHORTURL_VALUES } from '../constants.js'

const SLUG_REGEX = /^[a-zA-Z0-9]+$/

export const getShortUrl = async (req, res) => {
	const { slug } = req.params
	const url = await UrlModel.findOne({ where: { slug } })

	if (!url) {
		return res.status(404).json({ message: 'Short URL not found' })
	}

	await url.increment({ clicks: 1 })

	res.redirect(url.long_url)
}

export const checkSlug = async (req, res, next) => {
	const { slug } = req.body

	// Check if slug is not empty
	if (!slug) {
		return res.status(404).json({ message: 'generic', isAvailable: false })
	}

	// Check if slug is valid (minLength and maxLength)
	if (slug.length < SHORTURL_VALUES.initialLength) {
		return res.status(403).json({ message: 'minLength', isAvailable: false })
	}
	if (slug.length > SHORTURL_VALUES.maxLength) {
		return res.status(403).json({ message: 'maxLength', isAvailable: false })
	}
	// Check if slug is valid (only letters and numbers)
	if (!SLUG_REGEX.test(slug)) {
		return res.status(403).json({ message: 'invalid', isAvailable: false })
	}

	// Check if slug is already in use
	const shorturl = await ShortUrlModel.findOne({ where: { slug } })

	if (shorturl) {
		return res.status(409).json({ message: 'alreadyInUse', isAvailable: false })
	}

	next()
}

export const returnSlugAvailability = (_req, res) => {
	return res.status(200).json({ isAvailable: true })
}

export const getSlugData = async (req, res) => {
	const { slug } = req.params
	const shortUrl = await ShortUrlModel.findOne({
		attributes: ['url_id', 'slug'],
		where: { slug },
	})

	if (!shortUrl) {
		return res.status(404).json({ message: 'Short URL not found' })
	}

	const url = await UrlModel.findOne({
		attributes: ['id_urls', 'long_url', 'password', 'expired'],
		where: { id_urls: shortUrl.url_id, deleted: false },
	})

	if (!url) {
		return res.status(404).json({ message: 'Short URL not found' })
	}

	if (url.expired) {
		return res.status(404).json({ message: 'Short URL expired' })
	}

	res.json(url)
}

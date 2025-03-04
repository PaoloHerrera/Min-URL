import { UrlModel } from '../models/Url.js'
import { LogUrlModel } from '../models/LogUrl.js'
import { validateUrl } from '../schema/url.js'
import { validateLogUrl } from '../schema/logurl.js'
import { SHORTURL_VALUES } from '../constants.js'
import { createUrlObject, createLogUrlObject } from './UrlObjects.js'
import { SlugGenerator } from '../classes/SlugGenerator.js'

const saveUrl = async (data) => {
	const result = validateUrl(data)
	if (!result.success) {
		throw new Error(result.error.message)
	}
	return await UrlModel.create(result.data)
}

export const createShortUrl = async (req, _res, next) => {
	const generator = new SlugGenerator({
		initialLength: SHORTURL_VALUES.initialLength,
		maxAttempts: SHORTURL_VALUES.maxAttempts,
		maxLength: SHORTURL_VALUES.maxLength,
	})

	const slug = await generator.generateUniqueSlug(req.body.originalUrl)
	const urlData = createUrlObject(req, slug)

	const {
		dataValues: { created_at },
	} = await saveUrl(urlData)

	req.shorturl = `${req.protocol}://${req.get('host')}/${slug}`
	req.created_at = created_at
	req.slug = slug
	next()
}

export const sendShortUrl = (req, res) =>
	res.send({
		shortUrl: req.shorturl,
		purpose: req.purpose,
		createdAt: req.created_at,
	})

export const getShortUrl = async (req, res) => {
	const { slug } = req.params
	const url = await UrlModel.findOne({ where: { slug } })

	if (!url) {
		return res.status(404).json({ message: 'Short URL not found' })
	}

	await url.increment({ clicks: 1 })
	await LogUrlModel.create(validateLogUrl(createLogUrlObject(req, url)).data)

	res.redirect(url.long_url)
}

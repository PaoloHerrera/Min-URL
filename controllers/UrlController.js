import crypto from 'node:crypto'
import { UrlModel } from '../models/Url.js'
import { LogUrlModel } from '../models/LogUrl.js'
import { validateUrl } from '../schema/url.js'
import { validateLogUrl } from '../schema/logurl.js'
import { base64ToBase62 } from '../utils/utils.js'
import { SHORTURL_VALUES } from '../constants.js'

const ERROR_MESSAGE = 'Error creating Short URL. Please try again later.'

const generateHash = (input) => {
	return crypto.createHash('sha256').update(input).digest('base64')
}

const validateSlugLength = (slug, length) => {
	if (slug.length < length) {
		throw new Error(ERROR_MESSAGE)
	}
}

class SlugGenerator {
	constructor(config) {
		this.config = config
	}

	// Esta función permite crear una ShortUrl con intentos
	// Recibe una URL y devuelve una promise que se resuelve con el slug
	// Si no se resuelve, se devuelve un error
	async generateUniqueSlug(longUrl) {
		let attempts = 0
		const { maxLength, maxAttempts } = this.config
		let currentLength = this.config.initialLength

		while (currentLength <= maxLength) {
			const slug = await this.generateSlugAttempts(longUrl, currentLength)
			if (slug) return slug

			attempts = this.handleFailedAttempts(attempts, maxAttempts)
			currentLength = this.adjustLength(attempts, currentLength)
		}

		throw new Error(ERROR_MESSAGE)
	}

	// Esta función crea un slug basado en la URL y el largo que se quiere asignar
	// Recibe una URL y un largo y devuelve una promise que se resuelve con el slug
	// Si no se resuelve, se devuelve un error
	async generateSlugAttempts(longUrl, length) {
		try {
			const inputForSlug = `${longUrl}-${crypto.randomUUID()}`
			const base62Hash = base64ToBase62(generateHash(inputForSlug))
			validateSlugLength(base62Hash, length)
			const slug = base62Hash.substring(0, length)
			return (await this.isSlugAvailable(slug)) ? slug : ''
		} catch (error) {
			throw new Error(ERROR_MESSAGE)
		}
	}

	//Verifica si el slug ya existe
	async isSlugAvailable(slug) {
		try {
			const exists = await UrlModel.findOne({ where: { slug } })
			return !exists
		} catch (error) {
			throw new Error(ERROR_MESSAGE)
		}
	}

	async handleFailedAttempts(attempts, maxAttempts) {
		if (attempts >= maxAttempts) {
			return 0
		}
		return attempts + 1
	}

	async adjustLength(attempts, currentLength) {
		attempts === 0 ? currentLength + 1 : currentLength
		return currentLength
	}
}

const createUrlObject = (req, slug) => ({
	longurl: req.body.originalUrl,
	id_url_hash: crypto.randomUUID(),
	slug,
	purpose: req.purpose,
	ip_address: req.originalIp,
	...extractGeoData(req.geo),
})

const createLogUrlObject = (req, url) => ({
	url_id_url: url.dataValues.id_url,
	id_logurl_hash: crypto.randomUUID(),
	ip_address: req.originalIp,
	...extractGeoData(req.geo),
})

const extractGeoData = (geo) => ({
	country: geo.country,
	region: geo.region,
	timezone: geo.timezone,
	city: geo.city,
	latitude: geo.ll[0],
	longitude: geo.ll[1],
})

const saveUrl = async (data) => {
	const result = validateUrl(data)
	if (!result.success) {
		throw new Error(result.error.message)
	}
	return UrlModel.create(result.data)
}

export const createShortUrl = async (req, res, next) => {
	const generator = new SlugGenerator({
		initialLength: SHORTURL_VALUES.initialLength,
		maxAttempts: SHORTURL_VALUES.maxAttempts,
		maxLength: SHORTURL_VALUES.maxLength,
	})

	const slug = await generator.generateUniqueSlug(req.body.originalUrl)
	const urlData = createUrlObject(req, slug)

	await saveUrl(urlData)

	req.shorturl = `${req.protocol}://${req.get('host')}/${slug}`
	req.slug = slug
	next()
}

export const sendShortUrl = (req, res) => res.send(req.shorturl)

export const getShortUrl = async (req, res) => {
	const { slug } = req.params
	const url = await UrlModel.findOne({ where: { slug } })

	if (!url) return res.status(404).json({ message: 'Short URL not found' })

	await url.increment({ clicks: 1 })
	await LogUrlModel.create(validateLogUrl(createLogUrlObject(req, url)).data)

	res.redirect(url.longurl)
}

import crypto from 'node:crypto'
import geoip from 'geoip-lite'
import { UrlModel } from '../models/Url.js'
import { LogUrlModel } from '../models/LogUrl.js'
import { validateUrl } from '../schema/url.js'
import { validateLogUrl } from '../schema/logurl.js'
import { addHttpScheme } from '../utils/utils.js'
import { SHORTURL_VALUES } from '../constants.js'

// Función para obtener geolocalización
const getGeoLocation = (ip) => geoip.lookup(ip) || {}

// Esta función permite crear una ShortUrl con intentos
const generateShortUrl = async (longUrl, length, maxLength, maxAttempts) => {
	let attempts = 0
	let initialLength = length
	const normalizedUrl = addHttpScheme(longUrl)

	while (length <= maxLength) {
		const inputForShortUrl = `${normalizedUrl}-${crypto.randomUUID()}`

		//Se genera el hash de la url
		const hash = crypto
			.createHash('sha256')
			.update(inputForShortUrl)
			.digest('base64url')
		const shorturl = hash.substring(0, length)

		//Se verifica si la shorturl ya existe. Si no existe se devuelve la shorturl. Si ya existe se vuelve a intentar con un nuevo hash
		try {
			const exists = await UrlModel.findOne({ where: { shorturl } })
			if (!exists) return shorturl
		} catch (error) {
			throw new Error('Error creating Short URL. Please try again later.')
		}
		attempts++

		if (attempts >= maxAttempts) {
			initialLength++
			attempts = 0
		}
	}

	throw new Error('Error creating Short URL. Please try again later.')
}

export const createShortUrl = async (req, res) => {
	// Capturamos la ip del usuario
	let ip = req.ip

	const initialLength = SHORTURL_VALUES.initialLength
	const maxAttempts = SHORTURL_VALUES.maxAttempts
	const longUrl = req.body.originalUrl
	const maxLength = SHORTURL_VALUES.maxLength
	let resultUrl

	if (ip === '::1' || ip === '::ffff:127.0.0.1') ip = process.env.LOCAL_IP

	const geo = getGeoLocation(ip)

	console.log('geo: ', geo)
	console.log('ip: ', ip)

	// Verifica si geo es vacío
	if (Object.keys(geo).length === 0) {
		return res.status(400).json({
			message:
				"We couldn't generate your Short URL at this time. Please try again later.",
		})
	}

	try {
		//Generamos la shorturl
		const shorturl = await generateShortUrl(
			longUrl,
			initialLength,
			maxLength,
			maxAttempts,
		)

		// Usuario anónimo.
		// TODO: Incorporar usuario registrado
		const objectUrl = {
			longurl: addHttpScheme(longUrl),
			id_url_hash: crypto.randomUUID(),
			shorturl,
			ip_address: ip,
			country: geo.country,
			region: geo.region,
			timezone: geo.timezone,
			city: geo.city,
			latitude: geo.ll[0],
			longitude: geo.ll[1],
		}

		resultUrl = validateUrl(objectUrl)

		if (!resultUrl.success) {
			throw new Error(resultUrl.error.message)
		}
		await UrlModel.create(resultUrl.data)
		return `${req.protocol}://${req.get('host')}/${resultUrl.data.shorturl}`
	} catch (error) {
		console.log('Error al crear una nueva url: ', error.message)
		throw new Error('Error creating Short URL. Please try again later.')
	}
}

export const getShortUrl = async (req, res) => {
	const shorturl = req.params.id

	// Capturamos la ip del usuario
	let ip = req.ip

	if (ip === '::1') ip = process.env.LOCAL_IP
	const geo = getGeoLocation(ip)

	// Se consulta en la base de datos si existe la shorturl creada
	try {
		const url = await UrlModel.findOne({ where: { shorturl } })

		if (!url) return res.status(404).json({ message: 'Short URL not found' })

		// Si la url fue encontrada se actualiza la cantidad de clicks. Sumando +1
		await url.increment({ clicks: 1 })

		const objectLogUrl = {
			url_id_url: url.dataValues.id_url,
			id_logurl_hash: crypto.randomUUID(),
			ip_address: ip,
			country: geo.country,
			region: geo.region,
			timezone: geo.timezone,
			city: geo.city,
			latitude: geo.ll[0],
			longitude: geo.ll[1],
		}

		const resultLogUrl = validateLogUrl(objectLogUrl)

		if (!resultLogUrl.success) {
			return res.status(400).json({ error: resultLogUrl.error.message })
		}

		// Inserta el Log en la base de datos
		await LogUrlModel.create(resultLogUrl.data)

		res.redirect(url.longurl)
	} catch (error) {
		console.log('Error al leer la url: ', error.message)
		return res.status(400).json({ error: error.message })
	}
}

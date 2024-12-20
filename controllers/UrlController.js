import crypto from 'node:crypto'
import geoip from 'geoip-lite'
import { UrlModel } from '../models/Url.js'
import { LogUrlModel } from '../models/LogUrl.js'
import NanoidController from './NanoidController.js'
import { validateUrl } from '../schema/url.js'
import { validateLogUrl } from '../schema/logurl.js'
import { addHttpScheme } from '../utils/utils.js'
import { SHORTURL_VALUES } from '../constants.js'

// Función para obtener geolocalización
const getGeoLocation = (ip) => geoip.lookup(ip) || {}

// Esta función permite crear una ShortUrl con intentos
const generateShortUrl = async (length, maxAttempts) => {
  let attempts = 0
  let shorturl = ''
  while (attempts < maxAttempts) {
    try {
      const nanoid = await NanoidController.createNanoId(length)
      shorturl = nanoid()
      break
    } catch (error) {
      attempts++
      if (attempts >= maxAttempts) throw new Error('Error creating Short URL. Please try again later.')
    }
  }
  return shorturl
}

export default class UrlController {
  static async createShortUrl (req, res) {
    /* Primero se crea la ShortURL de largo 3 y con 20 intentos.
    Si no es posible insertar en la base de datos se aumenta el largo en 1 y se vuelve a intentar 20 veces
    y así sucesivamente hasta que se pueda crear la shortURL. (Máximo largo 10) */

    // Capturamos la ip del usuario
    let ip = req.ip
    let lengthShortUrl = SHORTURL_VALUES.initialLength
    const maxAttempts = SHORTURL_VALUES.maxAttempts
    let resultUrl, shorturl

    if (ip === '::1') ip = process.env.LOCAL_IP

    const geo = getGeoLocation(ip)

    console.log('geo: ', geo)
    console.log('ip: ', ip)

    // Verifica si geo es vacío
    if (Object.keys(geo).length === 0) {
      return res.status(400).json({ message: "We couldn't generate your Short URL at this time. Please try again later." })
    }

    while (lengthShortUrl <= SHORTURL_VALUES.maxLength) {
      try {
        shorturl = await generateShortUrl(lengthShortUrl, maxAttempts)
        // Usuario anónimo.
        // TODO: Incorporar usuario registrado
        const objectUrl = {
          longurl: addHttpScheme(req.body.originalUrl),
          id_url_hash: crypto.randomUUID(),
          shorturl,
          ip_address: ip,
          country: geo.country,
          region: geo.region,
          timezone: geo.timezone,
          city: geo.city,
          latitude: geo.ll[0],
          longitude: geo.ll[1]
        }

        resultUrl = validateUrl(objectUrl)

        if (!resultUrl.success) {
          return res.status(400).json({ error: resultUrl.error.message })
        }

        await UrlModel.create(resultUrl.data)

        const fullShortUrl = `${req.protocol}://${req.get('host')}/${resultUrl.data.shorturl}`
        return res.status(201).json({ fullShortUrl })
      } catch (error) {
        console.log('Error al crear una nueva url: ', error.message)
        if (lengthShortUrl <= SHORTURL_VALUES.maxLength) lengthShortUrl++
      }
    }

    return res.status(400).json({ message: "We couldn't generate your Short URL at this time. Please try again later." })
  }

  static async getShortUrl (req, res) {
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
        longitude: geo.ll[1]
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
}

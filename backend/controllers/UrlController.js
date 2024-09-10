import crypto from 'node:crypto'
import geoip from 'geoip-lite'
import { UrlModel } from '../models/Url.js'
import { LogUrlModel } from '../models/LogUrl.js'
import NanoidController from './NanoidController.js'
import { validateUrl } from '../schema/url.js'
import { validateLogUrl } from '../schema/logurl.js'
import { addHttpScheme } from '../utils/utils.js'
import axios from 'axios'

export default class UrlController {
  static async createShortUrl (req, res) {
    /* Primero se crea la ShortURL de largo 3 y con 20 intentos.
  Si no es posible insertar en la base de datos se aumenta el largo en 1 y se vuelve a intentar 20 veces
  y así sucesivamente hasta que se pueda crear la shortURL. (Máximo largo 10) */

    let lengthShortUrl = 3
    const maxAttemps = 20
    let initialAttemps = 0
    let iterationShortUrl = true
    let resultUrl, shorturl, ip

    while (iterationShortUrl) {
      if (initialAttemps === maxAttemps) {
        initialAttemps = 0
        lengthShortUrl++
      }
      // Verifica si el largo de la shorturl es mayor a 10. Si es así no crea la shorturl
      if (lengthShortUrl > 10) {
        iterationShortUrl = false
        return res.status(400).json({ error: JSON.parse('No fue posible crear la shorturl. Inténtelo de nuevo.') })
      }
      try {
        const nanoid = await NanoidController.createNanoId(lengthShortUrl)
        shorturl = nanoid()
      } catch (error) {
        return res.status(400).json({ error: JSON.parse('No fue posible crear la shorturl') })
      }
      // Solamente prueba en modo local
      try {
        const response = await axios.get('https://api.ipify.org?format=json')
        ip = response.data.ip
      } catch (error) {
        return res.status(400).json({ error: JSON.parse('No fue posible crear la shorturl') })
      }
      // Usuario anónimo.
      // TODO: Incorporar usuario registrado
      const geo = geoip.lookup(ip)
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
        return res.status(400).json({ error: JSON.parse(resultUrl.error.message) })
      }

      // Intenta insertar la shortURL en la base de datos
      try {
        await UrlModel.create(resultUrl.data)
        iterationShortUrl = false
      } catch (error) {
        console.log('Error al crear una nueva url: ', error.message)
      }
      initialAttemps++
    }
    const fullShortUrl = `${req.protocol}://${req.get('host')}/${resultUrl.data.shorturl}`
    res.status(201).json({ fullShortUrl })
  }

  static async getShortUrl (req, res) {
    const shorturl = req.params.id

    // Se consulta en la base de datos si existe la shorturl creada
    try {
      const url = await UrlModel.findOne({ where: { shorturl } })

      if (!url) res.status(404).redirect('/')

      // Si la url fue encontrada se actualiza la cantidad de clicks. Sumando +1
      await url.increment({ clicks: 1 })

      console.log(url.dataValues.id_url)

      /* Luego se crea el log con los datos de quien ingresó al link */
      // Se lee la ip
      const response = await axios.get('https://api.ipify.org?format=json')
      const ip = response.data.ip

      const geo = geoip.lookup(ip)
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
        return res.status(400).json({ error: JSON.parse(resultLogUrl.error.message) })
      }

      // Inserta el Log en la base de datos
      await LogUrlModel.create(resultLogUrl.data)

      res.redirect(url.longurl)
    } catch (error) {
      console.log('Error al leer la url: ', error.message)
      return res.status(400).json({ error: JSON.parse(error.message) })
    }
  }
}

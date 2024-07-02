import crypto from 'node:crypto'
import geoip from 'geoip-lite'
import { UrlModel } from '../models/Url.js'
import NanoidController from './NanoidController.js'
import { validateUrl } from '../schema/url.js'
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
    console.log(req.body.originalUrl)

    while (iterationShortUrl) {
      if (initialAttemps === maxAttemps) {
        initialAttemps = 0
        lengthShortUrl++
      }
      // Verifica si el largo de la shorturl es mayor a 10. Si es así no crea la shorturl
      if (lengthShortUrl > 10) {
        iterationShortUrl = false
        return res.status(400).json({ error: JSON.parse('No fue posible crear la shorturl') })
      }
      try {
        const nanoid = await NanoidController.createNanoId(lengthShortUrl)
        shorturl = nanoid()
        console.log(shorturl)
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

      console.log(resultUrl)

      if (!resultUrl.success) {
        return res.status(400).json({ error: JSON.parse(resultUrl.error.message) })
      }

      // Intenta insertar la shortURL en la base de datos
      try {
        await UrlModel.create(objectUrl)
        iterationShortUrl = false
      } catch (error) {
        console.log('Error al crear una nueva url: ', error.message)
      }
      initialAttemps++
    }

    res.status(201).json(resultUrl.data)
  }
}

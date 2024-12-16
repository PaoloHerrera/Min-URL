import validator from 'validator'
import { addHttpScheme } from '../utils/utils.js'

export const validateUrl = (req, res, next) => {
  let { originalUrl } = req.body

  // Si falta el protocolo se añade
  originalUrl = addHttpScheme(originalUrl)

  if (validator.isURL(originalUrl, { require_protocol: true })) {
    req.body.originalUrl = originalUrl
    next()
  } else {
    res.status(404).json({ error: 'La URL es inválida' })
  }
}

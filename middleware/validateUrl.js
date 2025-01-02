import validator from 'validator'
import { addHttpScheme } from '../utils/utils.js'

// Este middleware se encarga de validar la URL que se quiere guardar
// Si la URL es válida se guarda en el body de la petición
// Si no es válida se devuelve un error

export const validateUrl = (req, res, next) => {
	let { originalUrl } = req.body

	// Verifica si la URL viene y es un string
	if (!originalUrl || typeof originalUrl !== 'string') {
		return res.status(400).json({ message: 'Invalid URL.' })
	}

	// Si falta el protocolo se añade
	originalUrl = addHttpScheme(originalUrl)

	if (validator.isURL(originalUrl, { require_protocol: true })) {
		req.body.originalUrl = originalUrl
		next()
	} else {
		res.status(404).json({ message: 'Invalid URL.' })
	}
}

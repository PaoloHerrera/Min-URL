import { turnstileService } from '../services/turnstileService.js'

// Este middleware se encarga de verificar el token de recaptcha
// Si el token es válido se pasa al siguiente middleware
// Si no es válido se devuelve un error

export const verifyTurnstile = async (req, res, next) => {
	const token = req.body.turnstileToken
	if (!token) {
		res.status(400).json({ message: 'Turnstile token is missing.' })
		return
	}
	try {
		const response = await turnstileService(token)

		if (!response.success) {
			res.status(403).json({ message: 'Turnstile token is incorrect.' })
			return
		}
		next()
	} catch (_error) {
		console.log(_error)
		res.status(500).json({ message: 'Error verifying Turnstile token.' })
		return
	}
}

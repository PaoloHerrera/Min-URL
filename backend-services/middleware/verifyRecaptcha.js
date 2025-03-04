import axios from 'axios'

// Este middleware se encarga de verificar el token de recaptcha
// Si el token es válido se pasa al siguiente middleware
// Si no es válido se devuelve un error

export const verifyRecaptcha = async (req, res, next) => {
	const { recaptchaToken } = req.body

	try {
		const response = await axios.post(
			`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
		)

		if (response.data.success) {
			next()
		} else {
			res.status(400).json({ message: 'Invalid reCAPTCHA token.' })
		}
	} catch (error) {
		console.error('Error en el middleware de verificación de recaptcha:', error)
		res.status(500).json({ message: 'Server error. Try again later.' })
	}
}

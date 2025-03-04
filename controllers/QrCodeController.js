// biome-ignore lint/style/useNamingConvention: Import of qr code
import QRCode from 'qrcode'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { UrlModel } from '../models/Url.js'
import { uploadImage } from '../services/cloudinary.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Este controlador se encarga de crear el código QR

export const createQrCode = async (req, res) => {
	const { shorturl, slug } = req

	const outputPath = path.join(__dirname, `../assets/qrcodes/${Date.now()}.png`)

	await QRCode.toFile(outputPath, `${shorturl}`)

	const result = await uploadImage(outputPath)

	// Se actualiza la url con el nuevo código QR
	await UrlModel.update(
		// biome-ignore lint/style/useNamingConvention: UrlModel need use snake case
		{ qr_url: result.secure_url },
		{
			where: {
				slug,
			},
		},
	)

	res.send(result.secure_url)
}

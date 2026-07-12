import type { NextFunction, Request, Response } from 'express'

const forbiddenExtensions = [
	// Archivos ejecutables y scripts de sistema
	'.exe',
	'.bat',
	'.msi',
	'.sh',
	'.apk',
	'.bin',
	'.cmd',
	'.vbs',
	'.ps1',
	'.psm1',
	'.psd1',
	'.scr',
	'.com',
	'.jar',
	'.dll',
	'.xpi',
	'.crx',

	// Contenedores e imágenes de disco ejecutables
	'.dmg',
	'.iso',
	'.img',

	// Archivos de configuración y registros de sistema
	'.inf',
	'.reg',
	'.scf',
	'.lnk',
	'.class',
]

type Url = string

// Función para verificar si la extensión del archivo es prohibida
// Recibe una URL y devuelve true si la extensión es prohibida
// o false si no lo es
function hasForbiddenExtension(url: Url) {
	try {
		const urlPath = new URL(url).pathname
		const lastPart = urlPath.split('/').pop()
		const extension = lastPart?.includes('.')
			? `.${lastPart.split('.').pop()}`
			: ''
		return forbiddenExtensions.includes(`${extension}`)
	} catch (error) {
		console.log('Error en la función hasForbiddenExtension:', error)
		return true
	}
}

export const checkForbiddenExtension = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const { originalUrl } = req.body

	if (hasForbiddenExtension(originalUrl)) {
		return res.status(400).json({ message: 'Forbidden extension.' })
	}
	next()
}

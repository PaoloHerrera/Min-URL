export const REDIRECTOR_URL = process.env.REDIRECTOR_URL

export const SHORTURL_VALUES = {
	initialLength: 6,
	maxAttempts: 20,
	maxLength: 12,
}

export const LIMITS_VALUES = {
	limitShortUrlPerDay: 100,
	limitQrCodePerDay: 5,
}

export const FORBIDDEN_EXTENSIONS = [
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

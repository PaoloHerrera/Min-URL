import { MAX_SLUG_LENGTH, MIN_SLUG_LENGTH } from '@min-url/contracts/schemas'

export const SHORTURL_VALUES = {
	initialLength: MIN_SLUG_LENGTH,
	maxAttempts: 20,
	maxLength: MAX_SLUG_LENGTH,
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

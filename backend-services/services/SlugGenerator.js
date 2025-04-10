import crypto from 'node:crypto'
import { base64ToBase62 } from '../utils/utils.js'
import { ShortUrlModel } from '../models/ShortUrlModel.js'
import { generateHash } from '../utils/utils.js'

const ERROR_MESSAGE = 'Error creating Short URL. Please try again later.'

export class SlugGenerator {
	constructor(config) {
		this.config = config
	}

	// Esta función permite crear una ShortUrl con intentos
	// Recibe una URL y devuelve una promise que se resuelve con el slug
	// Si no se resuelve, se devuelve un error
	async generateUniqueSlug(longUrl) {
		let attempts = 0
		const { maxLength, maxAttempts } = this.config
		let currentLength = this.config.initialLength

		while (currentLength <= maxLength) {
			const slug = await this.generateSlugAttempts(longUrl, currentLength)
			if (slug) {
				return slug
			}

			attempts = this.handleFailedAttempts(attempts, maxAttempts)
			currentLength = this.adjustLength(attempts, currentLength)
		}

		throw new Error(ERROR_MESSAGE)
	}

	// Esta función crea un slug basado en la URL y el largo que se quiere asignar
	// Recibe una URL y un largo y devuelve una promise que se resuelve con el slug
	// Si no se resuelve, se devuelve un error
	async generateSlugAttempts(longUrl, length) {
		try {
			const inputForSlug = `${longUrl}-${crypto.randomUUID()}`
			const base62Hash = base64ToBase62(generateHash(inputForSlug, crypto))
			const slug = base62Hash.substring(0, length)
			return (await this.isSlugAvailable(slug)) ? slug : ''
		} catch (error) {
			throw new Error(error.message)
		}
	}

	//Verifica si el slug ya existe
	async isSlugAvailable(slug) {
		try {
			const exists = await ShortUrlModel.findOne({ where: { slug } })
			return !exists
		} catch (error) {
			throw new Error(error.message)
		}
	}

	handleFailedAttempts(attempts, maxAttempts) {
		return attempts >= maxAttempts ? 0 : attempts + 1
	}

	adjustLength(attempts, currentLength) {
		return attempts === 0 ? currentLength + 1 : currentLength
	}
}

import { customAlphabet } from 'nanoid'

export default class NanoidController {
  static async createNanoId (length) {
    // Se genera la id de la shortURL con los caracteres alfanuméricos y el largo especificado
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    return customAlphabet(characters, length)
  }
}

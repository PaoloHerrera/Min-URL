import { en } from './en.ts'
import { es } from './es.ts'
import type { Translations } from './types.ts'

export const dic: Record<'en' | 'es', Translations> = {
	en,
	es,
}

import { EN_TRANSLATIONS } from './en.ts'
import { ES_TRANSLATIONS } from './es.ts'
import type { Translations, State } from '@/types'

export const translations: Record<State['lang'], Translations> = {
	en: EN_TRANSLATIONS,
	es: ES_TRANSLATIONS,
}

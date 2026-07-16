import type { State, Translations } from '@/types'
import { EN_TRANSLATIONS } from './en.ts'
import { ES_TRANSLATIONS } from './es.ts'

export const translations: Record<State['lang'], Translations> = {
	en: EN_TRANSLATIONS,
	es: ES_TRANSLATIONS,
}

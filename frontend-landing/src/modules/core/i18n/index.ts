import { EN_TRANSLATIONS } from './en.ts'
import { ES_TRANSLATIONS } from './es.ts'
import type { Translations } from '@/modules/core/utils/types.d.ts'
import type { State } from '@/modules/core/reducers/AppReducer.ts'

export const translations: Record<State['lang'], Translations> = {
	en: EN_TRANSLATIONS,
	es: ES_TRANSLATIONS,
}

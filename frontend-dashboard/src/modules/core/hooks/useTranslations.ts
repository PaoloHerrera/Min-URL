import { useLanguageStore } from '@/stores/languageStore.ts'
import { translations } from '../i18n/index.ts'

export const useTranslations = () => {
	const { language } = useLanguageStore()
	return translations[language]
}

import { useLanguageStore } from '@/stores/languageStore'

export const useFormattedDate = (date: string | undefined) => {
	const { language } = useLanguageStore()
	return date ? new Date(date).toLocaleDateString(language) : ''
}

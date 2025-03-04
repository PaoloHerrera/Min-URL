import { useContext } from 'react'
import { AppContext } from '@/modules/core/context/AppContext.ts'
import { translations } from '@/modules/core/i18n/index.ts'
// import type { Translations } from '@/modules/core/utils/types.d.ts'

export const useTranslation = () => {
	const context = useContext(AppContext)

	if (!context) {
		throw new Error('useTranslation must be used within a AppProvider')
	}

	const { lang, setLang } = context

	const t = <T extends keyof (typeof translations)['en']>(key: T) => {
		return translations[lang][key]
	}

	return { t, lang, setLang }
}

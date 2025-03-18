import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/modules/core/ui/select.tsx'
import { LanguagesIcon } from 'lucide-react'
import type { Language } from '@/types'
import { useLanguageStore } from '@/modules/core/stores/languageStore'

const supportedLanguages = {
	en: 'English',
	es: 'Español',
}

export const LanguageSelector = () => {
	const { language, setLanguage } = useLanguageStore()

	const handleLanguageClick = (lang: Language) => {
		setLanguage(lang)
	}

	return (
		<Select
			value={language}
			onValueChange={(e) => handleLanguageClick(e as Language)}
		>
			<SelectTrigger className="bg-transparent text-mariner-500 gap-2 cursor-pointer">
				<LanguagesIcon className="w-4 h-4 hidden sm:block" />
				<SelectValue>
					<span className="font-semibold text-sm">
						{language.toUpperCase()}
					</span>
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{Object.keys(supportedLanguages).map((lang) => (
					<SelectItem key={lang} value={lang}>
						<div className="text-xs font-semibold flex gap-2 items-center">
							{lang.toLocaleUpperCase()}
							<span className="text-sm font-normal">
								{supportedLanguages[lang as Language]}
							</span>
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}

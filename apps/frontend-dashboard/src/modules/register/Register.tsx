import { translations } from '@/modules/core/i18n/index'
import { useLanguageStore } from '@/stores/languageStore.ts'
import { RegisterCard } from './components/RegisterCard.tsx'

export const Register = () => {
	const { language } = useLanguageStore()

	const translation = translations[language]

	return (
		<main className="flex flex-col justify-center min-h-screen bg-bg-base">
			<div className="flex flex-col items-center justify-center min-h-[650px]">
				<RegisterCard information={translation.register} />
			</div>
		</main>
	)
}

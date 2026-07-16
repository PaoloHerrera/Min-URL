import { translations } from '@/modules/core/i18n/index'
import { useLanguageStore } from '@/stores/languageStore.ts'
import { LoginCard } from './components/LoginCard.tsx'

export const Login = () => {
	const { language } = useLanguageStore()

	const translation = translations[language]

	return (
		<main className="flex flex-col justify-center min-h-screen bg-bg-base">
			<div className="flex flex-col items-center justify-center min-h-[550px]">
				<LoginCard information={translation.login} />
			</div>
		</main>
	)
}

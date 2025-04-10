import { LoginCard } from './components/LoginCard.tsx'
import { translations } from '@/modules/core/i18n/index'
import { useLanguageStore } from '@/stores/languageStore.ts'

export const Login = () => {
	const { language } = useLanguageStore()

	const translation = translations[language]

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-mariner-50">
			<div className="flex flex-col items-center justify-center">
				<LoginCard information={translation.login} />
			</div>
		</div>
	)
}

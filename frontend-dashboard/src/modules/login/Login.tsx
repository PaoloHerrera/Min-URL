import { LoginCard } from './components/LoginCard.tsx'
import { translations } from '@/modules/core/i18n/index'
import { useParams } from 'react-router'
import { useLogin } from '../core/hooks/useLogin.tsx'
import { useLanguageStore } from '../core/hooks/useLanguage.tsx'
import { useEffect } from 'react'
import type { Language } from '@/types'

export const Login = () => {
	const { lang = 'en' as Language } = useParams()
	const { language, setLanguage } = useLanguageStore()
	const { isLoggedIn, isLoading } = useLogin(lang as Language)

	const newLang = lang === 'es' ? 'es' : 'en'

	useEffect(() => {
		setLanguage(newLang)
	}, [newLang, setLanguage])

	const translation = translations[language]

	if (isLoading) {
		return <div>Loading...</div>
	}

	if (isLoggedIn) {
		console.log('Logged in')
		return null
	}
	console.log('Not logged in')

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-mariner-50">
			<div className="flex flex-col items-center justify-center">
				{isLoggedIn ? <></> : <LoginCard information={translation.login} />}
			</div>
		</div>
	)
}

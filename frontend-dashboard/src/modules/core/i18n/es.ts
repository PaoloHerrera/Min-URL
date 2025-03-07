import { MinUrlIcon, GithubIcon } from '@/modules/core/design-system/Icons'
import { MailIcon } from 'lucide-react'
import type { Translations } from '@/types'
import { VITE_GOOGLE_LOGIN_LINK, VITE_GITHUB_LOGIN_LINK } from '@/constants'

export const ES_TRANSLATIONS: Translations = {
	login: {
		logo: MinUrlIcon,
		companyName: 'Min-URL',
		title: 'Bienvenido a Min-URL',
		description:
			'Inicia sesión para acceder a tu panel y comenzar a crear enlaces cortos en tiempo real.',
		buttons: [
			{
				icon: MailIcon,
				text: 'Iniciar sesión con Google',
				link: VITE_GOOGLE_LOGIN_LINK,
			},
			{
				icon: GithubIcon,
				text: 'Iniciar sesión con GitHub',
				link: VITE_GITHUB_LOGIN_LINK,
			},
		],
		footer: 'Al iniciar sesión, aceptas nuestros',
		terms: 'Términos de servicio',
		conect: 'y',
		privacy: 'Política de privacidad',
	},
}

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
	dashboard: {
		navbar: {
			greetings: {
				morning: 'Buenos días',
				afternoon: 'Buenas tardes',
				evening: 'Buenas noches',
			},
			createNew: {
				new: 'Crear nuevo',
				link: 'Enlace',
				qrCode: 'Código QR',
			},
			search: 'Buscar enlaces',
			notifications: {
				title: 'Notificaciones',
				empty: 'Aún no hay notificaciones',
				seeAll: 'Ver todo',
			},
			profile: {
				title: 'Perfil',
				logout: 'Cerrar Sesión',
			},
			dialogNewLink: {
				title: 'Crear nuevo enlace',
				description: 'Acorta un URL largo y personaliza tu enlace.',
				originalUrl: {
					label: 'URL original',
					placeholder: 'https://example.com/muy/largo/url/que/necesita/acortar',
				},
				questionSlug: {
					label: '¿Personalizar tu slug?',
				},
				customSlug: {
					label: 'Slug personalizado',
					placeholder: 'mi-enlace-personalizado',
					error: {
						minLength: 'La longitud mínima es de 6',
						maxLength: 'La longitud máxima es de 12',
						invalid: 'Caracteres inválidos',
						alreadyInUse: 'El enlace ya está en uso',
					},
				},
				cancelText: 'Cancelar',
				submitText: 'Crear enlace',
			},
		},
	},
}

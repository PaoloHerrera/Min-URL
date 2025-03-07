import { MinUrlIcon, GithubIcon } from '@/modules/core/design-system/Icons'
import { MailIcon } from 'lucide-react'
import type { Translations } from '@/types'
import { VITE_GOOGLE_LOGIN_LINK, VITE_GITHUB_LOGIN_LINK } from '@/constants'

export const EN_TRANSLATIONS: Translations = {
	login: {
		logo: MinUrlIcon,
		companyName: 'Min-URL',
		title: 'Welcome to Min-URL',
		description:
			'Login to access your dashboard and start creating short URLs in real-time.',
		buttons: [
			{
				icon: MailIcon,
				text: 'Login with Google',
				link: VITE_GOOGLE_LOGIN_LINK,
			},
			{
				icon: GithubIcon,
				text: 'Login with GitHub',
				link: VITE_GITHUB_LOGIN_LINK,
			},
		],
		footer: 'By signing in, you agree to our',
		terms: 'Terms of Service',
		conect: 'and',
		privacy: 'Privacy Policy',
	},
}

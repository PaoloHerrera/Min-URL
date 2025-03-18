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

	dashboard: {
		navbar: {
			greetings: {
				morning: 'Good morning',
				afternoon: 'Good afternoon',
				evening: 'Good evening',
			},
			createNew: {
				new: 'Create new',
				link: 'Link',
				qrCode: 'QR code',
			},
			search: 'Search links',
			notifications: {
				title: 'Notifications',
				empty: 'No notifications yet',
				seeAll: 'See all',
			},
			profile: {
				title: 'Profile',
				logout: 'Log Out',
			},
			dialogNewLink: {
				title: 'Create New Link',
				description: 'Shorten a long URL and customize your link.',
				originalUrl: {
					label: 'Original URL',
					placeholder:
						'https://example.com/very/long/url/that/needs/shortening',
				},
				questionSlug: {
					label: 'Customize your slug?',
				},
				customSlug: {
					label: 'Custom Slug',
					placeholder: 'my-custom-link',
					error: {
						minLength: 'Minimum length is 6',
						maxLength: 'Maximum length is 12',
						invalid: 'Invalid characters',
						alreadyInUse: 'Short URL is already in use',
					},
				},
				cancelText: 'Cancel',
				submitText: 'Create Link',
			},
		},
	},
}

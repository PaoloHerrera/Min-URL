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
				link: 'Short URL',
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
				language: 'Language',
				logout: 'Log Out',
			},
			dialogNewLink: {
				title: 'Create New Short URL',
				description: 'Shorten a long URL and customize your link.',
				urlTitle: {
					label: 'Title',
					placeholder: 'My awesome link',
					error: {
						minLength: 'Minimum length is 1',
						maxLength: 'Maximum length is 100',
						generic: 'Error checking title. Please try again',
					},
				},
				originalUrl: {
					label: 'Website URL',
					placeholder:
						'https://example.com/very/long/url/that/needs/shortening',
					error: {
						minLength: 'Minimum length is 1',
						invalid: 'Invalid URL',
						generic: 'Error checking URL. Please try again',
					},
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
						invalid: 'Invalid characters. Only letters and numbers are allowed',
						tooManyRequests:
							'Too many requests. Please wait a minute and try again',
						alreadyInUse: 'Short URL is already in use',
						generic: 'Error checking slug. Please try again',
					},
				},
				cancelText: 'Cancel',
				submitText: 'Create Short URL',
				loadingSubmitText: 'Creating Short URL...',
				submitError: 'Error to create short URL. Please try again later.',
			},
			successLink: {
				title: 'Link Created Successfully!',
				description: 'Your shortened URL is ready to use and share.',
				linkStatistics: {
					title: 'Link Statistics',
					status: 'Status:',
					active: 'Active',
					clicks: 'Clicks:',
					created: 'Created:',
					expires: 'Expires:',
					never: 'Never',
				},
				copyLink: 'Copy Link',
				done: 'Done',
			},
			dialogNewQr: {
				title: 'Create New QR Code',
				description: 'Generate a QR code for a website.',
				qrCodeTitle: {
					label: 'Title',
					placeholder: 'My awesome QR code',
					error: {
						minLength: 'Minimum length is 1',
						maxLength: 'Maximum length is 100',
						generic: 'Error checking title. Please try again',
					},
				},
				originalUrl: {
					label: 'Website URL',
					placeholder:
						'https://example.com/very/long/url/that/needs/generating/a/qr/code',
					error: {
						minLength: 'Minimum length is 1',
						invalid: 'Invalid URL',
						generic: 'Error checking URL. Please try again',
					},
				},
				preview: 'QR Code Preview',
				previewDescription: 'Preview using sample data',
				foregroundColor: 'Foreground Color',
				backgroundColor: 'Background Color',
				cancelText: 'Cancel',
				submitText: 'Generate QR Code',
				loadingSubmitText: 'Creating QR Code...',
				submitError: 'Error to create QR Code. Please try again later.',
			},
		},
		sidebar: {
			usage: {
				link: 'Link Usage',
				qrcode: 'QR Codes Usage',
				used: 'Used',
				remaining: 'Remaining',
			},
			footer: {
				support: 'Support',
			},
		},
		content: {
			kpis: {
				totalClicks: 'Total Clicks',
				todayClicks: 'Today Clicks',
				activeLinks: 'Active Links',
				percentageUniqueClicks: 'Unique Click Rate',
			},
			last7DaysClicksTitle: 'Last 7 Days Clicks',
			geographicTitle: 'Geographic Distribution',
			deviceTitle: 'Device Breakdown',
			noData: 'No data available',
		},
	},

	link: {
		linkCard: {
			copy: 'Copy Link',
			externalLink: 'Open original link',
			statistics: 'View Statistics',
			edit: 'Edit Link',
			delete: 'Delete Link',

			deleteDialog: {
				title: 'Are you sure you want to delete this link?',
				description:
					'This action cannot be undone. This will permanently delete your link and all associated statistics.',
				cancelLabel: 'Cancel',
				deleteLabel: 'Delete',
				loadingDelete: 'Deleting...',
				success: 'Link deleted successfully',
				errorLabel: 'Error deleting link. Please try again later.',
			},
		},
		editDialog: {
			title: 'Edit Link',
			description: 'Update your link settings.',
			urlTitle: {
				label: 'Title',
				placeholder: 'My awesome link',
				error: {
					minLength: 'Minimum length is 1',
					maxLength: 'Maximum length is 100',
					generic: 'Error checking title. Please try again',
				},
			},
			originalUrl: {
				label: 'Website URL',
				placeholder: 'https://example.com/very/long/url/that/needs/shortening',
				error: {
					minLength: 'Minimum length is 1',
					invalid: 'Invalid URL',
					generic: 'Error checking URL. Please try again',
				},
				cannotBeChanged: {
					prefix: 'This link has been clicked ',
					suffix: ' times and the Website URL cannot be changed.',
				},
			},
			cancelLabel: 'Cancel',
			submitLabel: 'Update Link',
			loadingSubmit: 'Updating...',
			submitError: 'Error updating link. Please try again later.',
		},
	},

	qrcode: {
		qrcodeCard: {
			details: 'View Details',
			download: 'Download QR Code',
			externalLink: 'Open original link',

			deleteDialog: {
				title: 'Are you sure you want to delete this QR code?',
				description:
					'This action cannot be undone. This will permanently delete your QR code and all associated statistics.',
				cancelLabel: 'Cancel',
				deleteLabel: 'Delete',
				loadingDelete: 'Deleting...',
				success: 'QR code deleted successfully',
				errorLabel: 'Error deleting QR code. Please try again later.',
			},
		},
	},

	timeAgo: {
		now: 'Just now',
		minute: '1 minute ago',
		minutes: 'minutes ago',
		hour: '1 hour ago',
		hours: 'hours ago',
		day: '1 day ago',
		days: 'days ago',
		week: '1 week ago',
		weeks: 'weeks ago',
		month: '1 month ago',
		months: 'months ago',
		year: '1 year ago',
		years: 'years ago',
	},
}

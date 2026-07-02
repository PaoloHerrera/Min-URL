export interface Translations {
	nav: {
		home: string
		features: string
		dashboard: string
		why: string
		faq: string
		sponsor: string
		login: string
		register: string
		// Mobile menu preference labels
		language: string
		theme: string
		themeLight: string
		themeDark: string
	}
	hero: {
		titleStart: string
		titleGradient: string
		description: string
		shortener: {
			placeholder: string
			button: string
			loading: string
			errorUrlInvalid: string
			errorShortenFailed: string
			successTitle: string
			successSubtitle: string
			copied: string
			copy: string
			visit: string
			downloadQr: string
			reset: string
		}
		qrTool: {
			tab: string
			placeholder: string
			button: string
			downloadQr: string
			errorInvalid: string
		}
		trust: {
			noAccount: string
			free: string
			openSource: string
		}
		mockup: {
			title: string
			clicks: string
			today: string
			countries: string
			spain: string
			usa: string
			mobile: string
			desktop: string
		}
	}
	features: {
		badge: string
		title: string
		description: string
		stats: string
		items: {
			instant: { title: string; desc: string }
			analytics: { title: string; desc: string }
			geo: { title: string; desc: string }
			control: { title: string; desc: string }
		}
	}
	architecture: {
		badge: string
		title: string
		description: string
		packages: {
			users: { name: string; desc: string }
			services: { name: string; desc: string }
			redirector: { name: string; desc: string }
			infra: { name: string; desc: string }
		}
		sponsorTitle: string
		sponsorDesc: string
		githubBtn: string
		coffeeBtn: string
	}
	footer: {
		text: string
	}
}

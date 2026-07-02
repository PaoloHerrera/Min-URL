import type { Translations } from './types.ts'

export const en: Translations = {
	nav: {
		home: 'Home',
		features: 'Features',
		dashboard: 'Dashboard',
		why: 'Why',
		faq: 'FAQ',
		sponsor: 'Sponsor',
		login: 'Log In',
		register: 'Register',
		language: 'Language',
		theme: 'Theme',
		themeLight: 'Light',
		themeDark: 'Dark',
	},
	hero: {
		titleStart: 'Build shorter and',
		titleGradient: 'more powerful links',
		description:
			'Shorten URLs and generate dynamic QR codes instantly. Analyze real-time metrics with a robust, ultra-fast microservices architecture.',
		shortener: {
			placeholder: 'https://example.com/my-long-url',
			button: 'Shorten URL',
			loading: 'Shorten...',
			errorUrlInvalid: 'Please enter a valid URL.',
			errorShortenFailed: 'Something went wrong. Please try again later.',
			successTitle: 'Your link has been shortened!',
			successSubtitle: 'Ready to share',
			copied: 'Copied!',
			copy: 'Copy',
			visit: 'Visit',
			downloadQr: 'Download QR',
			reset: 'Shorten another link',
		},
		qrTool: {
			tab: 'QR Generator',
			placeholder: 'https://example.com/my-long-url',
			button: 'Generate QR',
			downloadQr: 'Download QR',
			errorInvalid: 'Please enter a valid URL.',
		},
		trust: {
			noAccount: 'No account needed',
			free: '100% free',
			openSource: 'Open source MIT',
		},
		mockup: {
			title: 'MIN-URL ANALYTICS',
			clicks: 'Total Clicks',
			today: '+24% today',
			countries: 'Top Countries',
			spain: 'Spain',
			usa: 'United States',
			mobile: 'Mobile',
			desktop: 'Desktop',
		},
	},
	features: {
		badge: 'Everything you need',
		title: 'Advanced tools for link management',
		description:
			'Min-URL is not just a basic shortener. We designed a premium, non-blocking workflow that provides detailed analytics.',
		stats: 'Views',
		items: {
			instant: {
				title: 'Instant Shortening',
				desc: 'Convert long links into memorable short URLs in milliseconds using our optimized generator.',
			},
			analytics: {
				title: 'Real-Time Analytics',
				desc: 'Live performance metrics including daily clicks, visitor countries, and device types.',
			},
			geo: {
				title: 'Offline Geolocation',
				desc: 'Integrated geographical mapping of visitors without external APIs, ensuring privacy and speed.',
			},
			control: {
				title: 'Link Control',
				desc: 'Support for custom slugs, automatic expiration dates, and password protection for URLs.',
			},
		},
	},
	architecture: {
		badge: 'Monorepo Architecture',
		title: 'Designed for Real Scalability',
		description:
			'Min-URL is built as a **monorepo structured with Turborepo and Bun**. We separate redirect logic from administrative services to maximize speed and security.',
		packages: {
			users: {
				name: 'backend-users (NestJS 11)',
				desc: 'Handles secure OAuth 2.0 authentication (Google) and provides aggregated data to the admin dashboard.',
			},
			services: {
				name: 'backend-services (Express)',
				desc: 'Main API services to shorten links, generate QR codes, and persist analytics asynchronously.',
			},
			redirector: {
				name: 'backend-redirector (Remix SSR)',
				desc: 'Ultra-fast redirect engine. Performs visitor tracking and publishes the event to Redis.',
			},
			infra: {
				name: 'Infrastructure (Docker)',
				desc: 'Local Docker Compose containers for PostgreSQL 16 (relational database with indexes and views) and Redis (event queue).',
			},
		},
		sponsorTitle: '100% Open Source & Production Ready',
		sponsorDesc:
			'Released under the MIT license. Clone it, run the database locally via Docker Compose, and deploy the API on your own VPS server without limitations.',
		githubBtn: 'View on GitHub',
		coffeeBtn: 'Buy me a coffee ☕',
	},
	footer: {
		text: 'Min-URL. MIT License. Developed with ❤️.',
	},
}

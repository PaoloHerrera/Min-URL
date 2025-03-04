import type { Translations } from '@/modules/core/utils/types.d.ts'
import {
	ShieldCheckIcon,
	ActivityIcon,
	UnplugIcon,
	BadgeCheckIcon,
	CalendarClockIcon,
	LockIcon,
	ChartBarIcon,
	EarthIcon,
	ZapIcon,
	RocketIcon,
	HeartIcon,
} from 'lucide-react'

export const EN_TRANSLATIONS: Translations = {
	navbarLinks: {
		home: 'Home',
		features: 'Features',
		pricing: 'Pricing',
	},
	navbarButtons: {
		language: 'English',
		signUp: 'Sign Up',
		signIn: 'Sign In',
	},
	hero: {
		header: {
			ariaLabel: 'URL Shortener and QR Code Generator',
			title: 'Build stronger links',
			subtitle:
				'A project that allows you to shorten URLs with a single click. Built with React, TypeScript and a scalable architecture',
			generatorTitle: 'Generate your',
			chipTitle: 'Open Source Project 🚀',
		},
		modes: {
			shorturl: 'Min URL',
			qrcode: 'QR Code',
		},
		buttons: {
			shorturl: 'Shorten',
			qrcode: 'Generate',
		},
		formLabels: {
			shorturl: 'Enter URL to shorten',
			qrcode: 'Enter URL for QR Code',
		},
		common: {
			generating: 'Generating...',
			loading: 'Loading content',
			copy: 'Copy to clipboard',
			copied: 'Copied!',
			open: 'Open in new tab',
			yourShortUrl: 'Your Short URL',
			createdAt: 'Created at',
			secondsAgo: 'seconds ago',
		},
		error: {
			invalidUrl: 'Please enter a valid URL',
			defaultError: 'An error occurred. Please try again later',
		},
		code: ` 
	// Min-URL API Example
	const createShortUrl = async (url) => {
		const response = await fetch('/api/shorten', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ url }),
		});
		
		return response.json();
	};
		
	// React Component Example
	const UrlShortener = () => {
		const [url, setUrl] = useState("");
			
		const handleSubmit = async () => {
			const shortUrl = await createShortUrl(url);
			console.log(shortUrl);
		};
		
		return (
			<div className="url-shortener">
				{/* Component Content */}
			</div>
		);
	};`,
	},
	features: [
		{
			id: 'fast-shortening',
			icon: ActivityIcon,
			title: '1-Click Shortening',
			description: 'Convert URLs instantly with our optimized algorithm',
		},
		{
			id: 'military-encryption',
			icon: ShieldCheckIcon,
			title: 'Military-Grade Encryption',
			description: 'All links protected with SSL/TLS and GDPR compliance',
		},
		{
			id: 'api-integration',
			icon: UnplugIcon,
			title: 'API Integration (Coming Soon)',
			description: 'Integrate Min-URL with your favorite tools',
		},
	],
	smartSolutions: {
		header: 'Power Your Workflow',
		subheader: 'Beyond Shortening',
		content: [
			{
				id: 'custom-short-links',
				title: 'Custom Short Links',
				icon: BadgeCheckIcon,
				description:
					'Create memorable links with custom slugs that reflect your business',
			},
			{
				id: 'link-lifecycle-control',
				title: 'Link Lifecycle Control',
				icon: CalendarClockIcon,
				description:
					'Set expiration dates for your links and keep control of your content',
			},
			{
				id: 'password-protection-links',
				title: 'Password Protection Links',
				icon: LockIcon,
				description:
					'Secure your links with custom passwords for controlled and secure access',
			},
			{
				id: 'realtime-analytics',
				title: 'Realtime Analytics',
				icon: ChartBarIcon,
				description:
					'Get detailed statistics on your links with click analytics',
			},
			{
				id: 'geolocation',
				title: 'Geolocation',
				icon: EarthIcon,
				description:
					'Get the exact location of your visitors for precise tracking',
			},
			{
				id: 'secure-links',
				title: 'Secure Links',
				icon: ShieldCheckIcon,
				description:
					'Prevent spam and malicious content with automated spam protection',
			},
		],
	},
	freeSection: {
		header: 'Free and Easy to Use',
		subheader:
			'No registration, no complications. With a generous daily limit per user',
		content: [
			{
				id: 'free-links-every-day',
				title: '50 Links Daily',
				icon: ZapIcon,
				description:
					'Enjoy up 50 links and 25 QR codes every day, totally free',
			},
			{
				id: 'faster-simple',
				title: 'Faster and Simple',
				icon: RocketIcon,
				description:
					'Simple interface and fast speeds, no more waiting for your links to be generated',
			},
			{
				id: 'no-need-registration',
				title: 'No Need Registration',
				icon: HeartIcon,
				description:
					'Start to use Min-URL without any registration, just enter your URL and start generating links',
			},
		],
	},
} as const

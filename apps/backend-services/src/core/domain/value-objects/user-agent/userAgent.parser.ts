import type {
	SupportedBrowser,
	SupportedDevice,
	SupportedOS,
} from '@min-url/contracts/analytics'

export interface ParsedUserAgent {
	browser: SupportedBrowser
	os: SupportedOS
	device: SupportedDevice
}

const BROWSER_RULES: Array<{ name: SupportedBrowser; regex: RegExp }> = [
	{ name: 'Edge', regex: /edg(?:e|a|ios)?\/\d+/i },
	{ name: 'Opera', regex: /(?:opr|opera)\/\d+/i },
	{ name: 'Chrome', regex: /chrome\/\d+/i },
	{ name: 'Firefox', regex: /firefox\/\d+/i },
	{ name: 'Safari', regex: /safari\/\d+/i },
]

const OS_RULES: Array<{ name: SupportedOS; regex: RegExp }> = [
	{ name: 'iOS', regex: /(?:iphone|ipad|ipod)/i },
	{ name: 'Android', regex: /android/i },
	{ name: 'macOS', regex: /(?:macintosh|mac os x)/i },
	{ name: 'Windows', regex: /(?:windows nt|win32|win64)/i },
	{ name: 'Linux', regex: /linux/i },
]

const TABLET_REGEX = /ipad|tablet/i
const MOBILE_REGEX = /mobile|iphone|android/i

export function parseUserAgent(raw: string): ParsedUserAgent {
	if (!raw || raw === 'unknown' || raw.trim() === '') {
		return { browser: 'unknown', os: 'unknown', device: 'unknown' }
	}

	let browser: SupportedBrowser = 'unknown'
	for (const rule of BROWSER_RULES) {
		if (rule.regex.test(raw)) {
			browser = rule.name
			break
		}
	}

	let os: SupportedOS = 'unknown'
	for (const rule of OS_RULES) {
		if (rule.regex.test(raw)) {
			os = rule.name
			break
		}
	}

	let device: SupportedDevice = 'unknown'
	if (TABLET_REGEX.test(raw)) {
		device = 'tablet'
	} else if (MOBILE_REGEX.test(raw)) {
		device = 'mobile'
	} else if (os === 'macOS' || os === 'Windows' || os === 'Linux') {
		device = 'desktop'
	}

	return { browser, os, device }
}

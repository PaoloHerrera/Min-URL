export const SUPPORTED_BROWSERS = [
	'Edge',
	'Opera',
	'Chrome',
	'Firefox',
	'Safari',
	'unknown',
] as const

export type SupportedBrowser = (typeof SUPPORTED_BROWSERS)[number]

export const SUPPORTED_OS = [
	'iOS',
	'Android',
	'macOS',
	'Windows',
	'Linux',
	'unknown',
] as const

// biome-ignore lint/style/useNamingConvention: OS is standard uppercase acronym
export type SupportedOS = (typeof SUPPORTED_OS)[number]

export const SUPPORTED_DEVICES = [
	'desktop',
	'mobile',
	'tablet',
	'unknown',
] as const

export type SupportedDevice = (typeof SUPPORTED_DEVICES)[number]

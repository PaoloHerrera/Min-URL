import type React from 'react'
import type { LucideProps } from 'lucide-react'

export type Language = 'en' | 'es'

export type State = {
	lang: Language
}

export type LoginButtonProps = {
	icon:
		| React.ComponentType<React.SVGProps<SVGSVGElement>>
		| React.ComponentType<LucideProps>
	text: string
	link: string
}

export interface LoginProps {
	logo: React.ComponentType
	companyName: string
	title: string
	description: string
	buttons: LoginButtonProps[]
	footer: string
	terms: string
	conect: string
	privacy: string
}

export interface LoginCardProps {
	information: LoginProps
}

export interface CreateNewProps {
	new: string
	link: string
	qrCode: string
}
export interface DialogNewLinkProps {
	title: string
	description: string
	originalUrl: {
		label: string
		placeholder: string
		errorMessage: string
	}
	questionSlug: {
		label: string
	}
	customSlug: {
		label: string
		placeholder: string
		error: {
			minLength: string
			maxLength: string
			invalid: string
			alreadyInUse: string
			generic: string
		}
	}
	cancelText: string
	submitText: string
	loadingSubmitText: string
}

export type SuccessLinkProps = {
	title: string
	description: string
	linkStatistics: {
		title: string
		status: string
		active: string
		clicks: string
		created: string
		expires: string
		never: string
	}
	copyLink: string
	done: string
}

export interface Translations {
	login: LoginProps
	dashboard: {
		navbar: {
			greetings: {
				morning: string
				afternoon: string
				evening: string
			}
			createNew: CreateNewProps
			search: string
			notifications: {
				title: string
				empty: string
				seeAll: string
			}
			profile: {
				title: string
				language: string
				logout: string
			}
			dialogNewLink: DialogNewLinkProps
			successLink: SuccessLinkProps
		}
	}
}

type GeolocationType = {
	ip: string
	country: string
	city: string
	latitude: number
	longitude: number
}
export type ShortUrlType = {
	url: string
	shortUrl: string
	slug: string
	clicks?: number
	createdAt?: string
	updatedAt?: Date
	geoLocation?: GeolocationType[]
}

export type BasicStatsProps = {
	totalClicks: {
		total: number
		percentage: number
	}
	todayClicks: {
		total: number
		percentage: number
	}
	activeLinks: {
		total: number
		percentage: number
	}
	activeQrCodes: {
		total: number
		percentage: number
	}
}

export type ClickPerformanceProps = {
	lastYear: Record<number>
	lastSevenDays: Record<number>
	today: Record<number>
}

export type StatsStoreType = {
	basicStats: BasicStatsProps | null
	clickPerformance: ClickPerformanceProps | null
	shortUrls: ShortUrlType[] | null
	isLoading: boolean
	setStats: (
		basicStats: BasicStatsProps | null,
		clickPerformance: ClickPerformanceProps | null,
		shortUrls: ShortUrlType[] | null,
		isLoading: boolean,
	) => void
}

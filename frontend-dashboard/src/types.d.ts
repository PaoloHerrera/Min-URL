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

export interface BasicUrlFormProps {
	title: string
	description: string
	urlTitle: {
		label: string
		placeholder: string
		error: {
			minLength: string
			maxLength: string
			generic: string
		}
	}
	originalUrl: {
		label: string
		placeholder: string
		error: {
			minLength: string
			invalid: string
			generic: string
		}
		cannotBeChanged?: {
			prefix: string
			suffix: string
		}
	}
}

export interface DialogNewLinkProps extends BasicUrlFormProps {
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
			tooManyRequests: string
			alreadyInUse: string
			generic: string
		}
	}
	cancelText: string
	submitText: string
	loadingSubmitText: string
	submitError: string
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

export type DialogNewQrProps = {
	title: string
	description: string
	qrCodeTitle: {
		label: string
		placeholder: string
		error: {
			minLength: string
			maxLength: string
			generic: string
		}
	}
	originalUrl: {
		label: string
		placeholder: string
		error: {
			minLength: string
			invalid: string
			generic: string
		}
	}
	preview: string
	previewDescription: string
	foregroundColor: string
	backgroundColor: string
	cancelText: string
	submitText: string
	loadingSubmitText: string
	submitError: string
}

export interface EditDialogProps extends BasicUrlFormProps {
	cancelLabel: string
	submitLabel: string
	loadingSubmit: string
	submitError: string
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
			dialogNewQr: DialogNewQrProps
		}
		sidebar: {
			usage: {
				link: string
				qrcode: string
				used: string
				remaining: string
			}
			footer: {
				support: string
			}
		}
		content: {
			kpis: {
				totalClicks: string
				todayClicks: string
				activeLinks: string
				percentageUniqueClicks: string
			}
			last7DaysClicksTitle: string
			geographicTitle: string
			deviceTitle: string
			noData: string
		}
	}
	link: {
		linkCard: {
			copy: string
			externalLink: string
			statistics: string
			edit: string
			delete: string

			deleteDialog: {
				title: string
				description: string
				cancelLabel: string
				deleteLabel: string
				loadingDelete: string
				success: string
				errorLabel: string
			}
		}
		editDialog: EditDialogProps
	}

	qrcode: {
		qrcodeCard: {
			details: string
			download: string
			externalLink: string

			deleteDialog: {
				title: string
				description: string
				cancelLabel: string
				deleteLabel: string
				loadingDelete: string
				success: string
				errorLabel: string
			}
		}
	}
	timeAgo: TimeAgoTextProps
}

export type TimeAgoTextProps = {
	now: string
	minute: string
	minutes: string
	hour: string
	hours: string
	day: string
	days: string
	week: string
	weeks: string
	month: string
	months: string
	year: string
	years: string
}

export type TopLinkProps = {
	id: string
	title: string
	clicks: number
	shortUrl: string
	slug: string
	longUrl: string
	createdAt: string
}

export type TopQrCodeProps = {
	id: string
	scans: number
	title: string
	url: string
	shortUrl: string
	slug: string
	foregroundColor: string
	backgroundColor: string
	createdAt: string
}

export type BasicStatsProps = {
	totalClicks: {
		total: number
	}
	todayClicks: {
		total: number
		percentage: number
	}
	activeLinks: {
		total: number
	}
	percentageUniqueClicks: {
		total: number
		percentage: number
	}
}

export type Last7DaysClicksProps = {
	clicks: number
	createdAt: string
}

export interface PieChartProps {
	name: string
	clicks: number
	color?: string
	percent: number
}

export type StatsStoreType = {
	basicStats: BasicStatsProps | null
	last7DaysClicks: Last7DaysClicksProps[] | null
	countryStats: PieChartProps[] | null
	deviceStats: PieChartProps[] | null
	topLinks: TopLinkProps[] | null
	topQrCodes: TopQrCodeProps[] | null
	isLoading: boolean
	setStats: (
		basicStats: BasicStatsProps | null,
		last7DaysClicks: Last7DaysClicksProps[] | null,
		countryStats: PieChartProps[] | null,
		deviceStats: PieChartProps[] | null,
		topLinks: TopLinkProps[] | null,
		topQrCodes: TopQrCodeProps[] | null,
		isLoading: boolean,
	) => void
}

export type ShortUrlType = {
	url: string
	shortUrl: string
	slug: string
	createdAt: string
}

export interface QrCodeType {
	title: string
	url: string
	shortUrl: string
	slug: string
	createdAt: string
	foregroundColor: string
	backgroundColor: string
}

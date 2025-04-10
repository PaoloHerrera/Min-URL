import { useStatsStore } from '@/stores/statsStore.ts'
import { useTranslations } from '@/modules/core/hooks/useTranslations.ts'
import { getTimeAgo } from '@/lib/getTimeAgo.ts'

export interface TopLinkData {
	title: string
	clicks: number
	shortUrl: string
	slug: string
	longUrl: string
	createdAt: string
}

export interface TopQrCodeData {
	scans: number
	title: string
	url: string
	shortUrl: string
	slug: string
	foregroundColor: string
	backgroundColor: string
	createdAt: string
}

export const useDashboardData = () => {
	const { basicStats, topLinks, topQrCodes } = useStatsStore()
	const { dashboard, timeAgo } = useTranslations()
	const { kpis } = dashboard.content

	// Porcentaje variación de clicks hoy
	const getColor = (
		percentage: number | undefined,
	): 'green' | 'red' | 'transparent' => {
		if ((percentage ?? 0) > 0) {
			return 'green'
		}
		if ((percentage ?? 0) < 0) {
			return 'red'
		}
		return 'transparent'
	}

	const todayClicksColor = getColor(basicStats?.todayClicks.percentage)
	const todayClicksPercentage = Math.abs(
		basicStats?.todayClicks.percentage ?? 0,
	)

	const uniqueClicksColor = getColor(
		basicStats?.percentageUniqueClicks.percentage,
	)
	const uniqueClicksPercentage = Math.abs(
		basicStats?.percentageUniqueClicks.percentage ?? 0,
	)

	// Top Links
	const topLinksData: TopLinkData[] =
		topLinks?.map((link) => ({
			title: link.title,
			clicks: link.clicks,
			shortUrl: link.shortUrl,
			slug: link.slug,
			longUrl: link.longUrl,
			createdAt: getTimeAgo(new Date(link.createdAt), timeAgo),
		})) || []

	// Top QR Codes
	const topQrCodesData: TopQrCodeData[] =
		topQrCodes?.map((qrCode) => ({
			scans: qrCode.scans,
			title: qrCode.title,
			url: qrCode.url,
			shortUrl: qrCode.shortUrl,
			slug: qrCode.slug,
			foregroundColor: qrCode.foregroundColor,
			backgroundColor: qrCode.backgroundColor,
			createdAt: getTimeAgo(new Date(qrCode.createdAt), timeAgo),
		})) || []

	return {
		basicStats,
		kpis,
		todayClicksColor,
		todayClicksPercentage,
		uniqueClicksColor,
		uniqueClicksPercentage,
		topLinksData,
		topQrCodesData,
	}
}

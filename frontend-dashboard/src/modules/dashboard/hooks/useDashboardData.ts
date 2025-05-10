import { useStatsStore } from '@/stores/statsStore.ts'
import { useTranslations } from '@/modules/core/hooks/useTranslations.ts'
import { getTimeAgo } from '@/lib/getTimeAgo.ts'
import type { TopLinkProps, TopQrCodeProps } from '@/types'

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
	const topLinksData: TopLinkProps[] =
		topLinks?.map((link) => ({
			id: link.id,
			title: link.title,
			clicks: link.clicks,
			shortUrl: link.shortUrl,
			slug: link.slug,
			longUrl: link.longUrl,
			createdAt: getTimeAgo(new Date(link.createdAt), timeAgo),
		})) || []

	// Top QR Codes
	const topQrCodesData: TopQrCodeProps[] =
		topQrCodes?.map((qrCode) => ({
			id: qrCode.id,
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

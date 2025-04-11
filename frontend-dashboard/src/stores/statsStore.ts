import { create } from 'zustand'
import type {
	BasicStatsProps,
	Last7DaysClicksProps,
	PieChartProps,
	TopLinkProps,
	TopQrCodeProps,
	StatsStoreType,
} from '@/types'

export const useStatsStore = create<StatsStoreType>((set) => ({
	basicStats: null,
	last7DaysClicks: null,
	countryStats: null,
	deviceStats: null,
	topLinks: null,
	topQrCodes: null,
	isLoading: true,
	setStats: (
		basicStats: BasicStatsProps | null,
		last7DaysClicks: Last7DaysClicksProps[] | null,
		countryStats: PieChartProps[] | null,
		deviceStats: PieChartProps[] | null,
		topLinks: TopLinkProps[] | null,
		topQrCodes: TopQrCodeProps[] | null,
		isLoading: boolean,
	) =>
		set({
			basicStats,
			last7DaysClicks,
			countryStats,
			deviceStats,
			topLinks,
			topQrCodes,
			isLoading,
		}),
}))

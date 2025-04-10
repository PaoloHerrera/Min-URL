import { create } from 'zustand'
import type {
	BasicStatsProps,
	PieChartProps,
	TopLinkProps,
	TopQrCodeProps,
	StatsStoreType,
} from '@/types'

export const useStatsStore = create<StatsStoreType>((set) => ({
	basicStats: null,
	countryStats: null,
	deviceStats: null,
	topLinks: null,
	topQrCodes: null,
	isLoading: true,
	setStats: (
		basicStats: BasicStatsProps | null,
		countryStats: PieChartProps[] | null,
		deviceStats: PieChartProps[] | null,
		topLinks: TopLinkProps[] | null,
		topQrCodes: TopQrCodeProps[] | null,
		isLoading: boolean,
	) =>
		set({
			basicStats,
			countryStats,
			deviceStats,
			topLinks,
			topQrCodes,
			isLoading,
		}),
}))

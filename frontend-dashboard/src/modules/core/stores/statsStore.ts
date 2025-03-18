import { create } from 'zustand'
import type {
	BasicStatsProps,
	ClickPerformanceProps,
	ShortUrlType,
	StatsStoreType,
} from '@/types'

export const useStatsStore = create<StatsStoreType>((set) => ({
	basicStats: null,
	clickPerformance: null,
	shortUrls: null,
	isLoading: true,
	setStats: (
		basicStats: BasicStatsProps | null,
		clickPerformance: ClickPerformanceProps | null,
		shortUrls: ShortUrlType[] | null,
		isLoading: boolean,
	) => set({ basicStats, clickPerformance, shortUrls, isLoading }),
}))

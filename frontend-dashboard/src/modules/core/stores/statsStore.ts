import { create } from 'zustand'
import type { ShortUrlType, StatsStoreType } from '@/types'

export const useStatsStore = create<StatsStoreType>((set) => ({
	shortUrls: null,
	isLoading: true,
	setStats: (shortUrls: ShortUrlType[] | null, isLoading: boolean) =>
		set({ shortUrls, isLoading }),
}))

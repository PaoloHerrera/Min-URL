import { create } from 'zustand'
import type { ShortUrlType } from '@/types'

interface NewShortUrlStore {
	newShortUrl: ShortUrlType | null
	setNewShortUrl: (lastShortUrl: ShortUrlType | null) => void
}

export const useNewShortUrlStore = create<NewShortUrlStore>((set) => ({
	newShortUrl: null,
	setNewShortUrl: (newShortUrl: ShortUrlType | null) => set({ newShortUrl }),
}))

import type { ShortUrlType } from '@/types'
import { create } from 'zustand'

interface NewShortUrlStore {
	newShortUrl: ShortUrlType | null
	serverError: string | null
	setNewShortUrl: (newShortUrl: ShortUrlType | null) => void
	setServerError: (serverError: string | null) => void
}

export const useNewShortUrlStore = create<NewShortUrlStore>((set) => ({
	newShortUrl: null,
	serverError: null,
	setServerError: (serverError: string | null) => set({ serverError }),
	setNewShortUrl: (newShortUrl: ShortUrlType | null) => set({ newShortUrl }),
}))

import type { QrCodeType } from '@/types'
import { create } from 'zustand'

interface NewQrCodeStore {
	newQrCode: QrCodeType | null
	serverError: string | null
	setNewQrCode: (newQrCode: QrCodeType | null) => void
	setServerError: (serverError: string | null) => void
}

export const useNewQrCodeStore = create<NewQrCodeStore>((set) => ({
	newQrCode: null,
	serverError: null,
	setServerError: (serverError: string | null) => set({ serverError }),
	setNewQrCode: (newQrCode: QrCodeType | null) => set({ newQrCode }),
}))

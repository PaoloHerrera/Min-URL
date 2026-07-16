import { create } from 'zustand'

interface DialogStoreType {
	openDialogLink: boolean
	openDialogQrCode: boolean
	setOpenDialogLink: (openDialogLink: boolean) => void
	setOpenDialogQrCode: (openDialogQrCode: boolean) => void
}

export const useDialogStore = create<DialogStoreType>((set) => ({
	openDialogLink: false,
	openDialogQrCode: false,
	setOpenDialogLink: (openDialogLink: boolean) => set({ openDialogLink }),
	setOpenDialogQrCode: (openDialogQrCode: boolean) => set({ openDialogQrCode }),
}))

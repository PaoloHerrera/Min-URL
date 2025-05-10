import { useState } from 'react'
import { toast } from 'sonner'
import { useTranslations } from '@/modules/core/hooks/useTranslations.ts'
import { deleteUrl } from '@/modules/core/services/api'

type EntityType = 'link' | 'qrcode'

interface DeletionState {
	isOpen: boolean
	isLoading: boolean
	error: string | null
}

interface UseEntityDeletionType {
	deleteState: DeletionState
	openDialog: () => void
	closeDialog: () => void
	deleteEntity: (id: string) => Promise<boolean>
}

export const useEntityDeletion = (
	entity: EntityType,
): UseEntityDeletionType => {
	const { link, qrcode } = useTranslations()
	const [deleteState, setDeleteState] = useState<DeletionState>({
		isOpen: false,
		isLoading: false,
		error: null,
	})

	const translation =
		entity === 'link'
			? link.linkCard.deleteDialog
			: qrcode.qrcodeCard.deleteDialog

	const openDialog = () => {
		setDeleteState({
			...deleteState,
			isOpen: true,
			error: null,
		})
	}

	const closeDialog = () => {
		setDeleteState({
			...deleteState,
			isOpen: false,
			error: null,
		})
	}

	const deleteEntity = async (id: string) => {
		setDeleteState({
			...deleteState,
			isLoading: true,
		})

		try {
			await deleteUrl(id)
			toast.success(translation.success)
			setDeleteState({
				...deleteState,
				isOpen: false,
				isLoading: false,
				error: null,
			})
			return true
		} catch {
			setDeleteState({
				...deleteState,
				isLoading: false,
				error: translation.errorLabel,
			})
			return false
		}
	}

	return {
		deleteState,
		openDialog,
		closeDialog,
		deleteEntity,
	}
}

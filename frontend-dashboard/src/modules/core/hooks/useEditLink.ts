import { useState } from 'react'

interface EditLinkState {
	isOpen: boolean
	isLoading: boolean
	error: string | null
}

export const useEditLink = () => {
	const [editState, setEditState] = useState<EditLinkState>({
		isOpen: false,
		isLoading: false,
		error: null,
	})

	const openEditDialog = () => {
		setEditState({
			...editState,
			isOpen: true,
			error: null,
		})
	}

	const closeEditDialog = () => {
		setEditState({
			...editState,
			isOpen: false,
			error: null,
		})
	}

	return {
		editState,
		openEditDialog,
		closeEditDialog,
	}
}

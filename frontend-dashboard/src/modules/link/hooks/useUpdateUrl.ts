import { updateUrl } from '@/modules/core/services/api.ts'
import { useState } from 'react'
import { AxiosError } from 'axios'

interface UpdateUrlState {
	isLoading: boolean
	error: string | null
}

interface UpdateUrlMutationData {
	id: string
	title: string
	url?: string
}

export const useUpdateUrl = () => {
	const [updateUrlState, setUpdateUrlState] = useState<UpdateUrlState>({
		isLoading: false,
		error: null,
	})

	const updateUrlMutation = async ({
		id,
		title,
		url,
	}: UpdateUrlMutationData) => {
		try {
			setUpdateUrlState({
				isLoading: true,
				error: null,
			})
			const response = await updateUrl(id, { title, url })
			setUpdateUrlState({
				isLoading: false,
				error: null,
			})
			return response
		} catch (err) {
			if (err instanceof AxiosError) {
				setUpdateUrlState({
					isLoading: false,
					error: err.message,
				})
				return
			}
			//Default error
			setUpdateUrlState({
				isLoading: false,
				error: 'Error updating link. Please try again later.',
			})
		}
	}

	return { updateUrlState, updateUrlMutation }
}

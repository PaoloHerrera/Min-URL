import { axiosInstance } from '../lib/axios.ts'

export const createShortUrl = async (data: {
	url: string
	customSlug: boolean
	slug?: string
}) => {
	const response = await axiosInstance.post('/protected/create-short-url', data)
	return response.data
}

export const createQrCode = async (data: {
	title: string
	url: string
	foregroundColor: string
	backgroundColor: string
}) => {
	const response = await axiosInstance.post('/protected/create-qr-code', data)
	return response.data
}

export const deleteUrl = async (id: string) => {
	const response = await axiosInstance.delete(`/protected/delete-url/${id}`)
	return response.data
}

export const updateUrl = async (
	id: string,
	{ title, url }: { title: string; url?: string },
) => {
	const response = await axiosInstance.patch(`/protected/update-url/${id}`, {
		title,
		url,
	})
	return response.data
}

export const updateQrCode = async (
	id: string,
	{
		title,
		url,
		foregroundColor,
		backgroundColor,
	}: {
		title: string
		url: string
		foregroundColor: string
		backgroundColor: string
	},
) => {
	const response = await axiosInstance.patch(
		`/protected/update-qr-code/${id}`,
		{
			title,
			url,
			foregroundColor,
			backgroundColor,
		},
	)
	return response.data
}

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

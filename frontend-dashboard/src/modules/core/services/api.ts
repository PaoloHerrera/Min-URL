import { axiosInstance } from '../lib/axios.ts'

export const createShortUrl = async (data: {
	url: string
	customSlug: boolean
	slug?: string
}) => {
	const response = await axiosInstance.post('/protected/create-short-url', data)
	return response.data
}

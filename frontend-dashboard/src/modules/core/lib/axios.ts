import axios from 'axios'

const BASE_URL = 'http://localhost:3000'

export const axiosInstance = axios.create({
	// biome-ignore lint/style/useNamingConvention: Axios use this
	baseURL: BASE_URL,
	withCredentials: true,
})

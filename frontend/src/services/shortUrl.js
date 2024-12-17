import axios from 'axios'

const SHORT_URL_API = 'http://localhost:1234/api/urls'

export async function fetchUrl (url) {
  try {
    const response = await axios.post(SHORT_URL_API, {
      originalUrl: url
    })
    return response.data.fullShortUrl
  } catch (error) {
    throw new Error(error.response.data.message)
  }
}

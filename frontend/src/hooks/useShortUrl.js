import { useContext } from 'react'
import { ShortUrlContext } from '../context/shortUrl'
import { fetchUrl } from '../services/shortUrl'

export function useShortUrl () {
  const { shortUrl, setShortUrl, loading, setLoading, error, setError } = useContext(ShortUrlContext)

  const getShortUrl = async ({ url }) => {
    try {
      setLoading(true)
      const newShortUrl = await fetchUrl(url)
      setShortUrl(newShortUrl)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  return { shortUrl, setShortUrl, loading, error, getShortUrl }
}

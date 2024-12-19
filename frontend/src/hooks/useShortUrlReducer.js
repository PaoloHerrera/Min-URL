import { useReducer, useCallback } from 'react'
import { shortUrlReducer, initialShortUrlState, SHORT_URL_ACTION_TYPES } from '../reducers/shortUrlReducer'
import { fetchUrl } from '../services/shortUrl'

export function useShortUrlReducer () {
  const [state, dispatch] = useReducer(shortUrlReducer, initialShortUrlState)
  const { shortUrl, error, loading } = state

  const dispatchAction = (type, payload) => {
    dispatch({ type, payload })
  }

  const setShortUrl = (shortUrl) => {
    dispatchAction(SHORT_URL_ACTION_TYPES.SET_SHORT_URL, shortUrl)
  }

  const clearError = () => {
    dispatchAction(SHORT_URL_ACTION_TYPES.SET_ERROR, null)
  }

  const getShortUrl = useCallback(async ({ url }) => {
    try {
      dispatchAction(SHORT_URL_ACTION_TYPES.SET_LOADING, true)
      const newShortUrl = await fetchUrl(url)
      setShortUrl(newShortUrl)
      clearError()
    } catch (error) {
      dispatchAction(SHORT_URL_ACTION_TYPES.SET_ERROR, error.message)
    } finally {
      dispatchAction(SHORT_URL_ACTION_TYPES.SET_LOADING, false)
    }
  }, [setShortUrl])

  return { shortUrl, error, loading, setShortUrl, getShortUrl }
}

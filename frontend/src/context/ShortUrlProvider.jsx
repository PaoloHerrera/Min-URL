import { ShortUrlContext } from './ShortUrlContext'
import { useShortUrlReducer } from '../hooks/useShortUrlReducer'

// Create a new provider component that takes children as a prop
export const ShortUrlProvider = ({ children }) => {
  // Create a state to hold the shortUrl
  const shortUrlState = useShortUrlReducer()

  return (
    <ShortUrlContext.Provider value={shortUrlState}>
      {children}
    </ShortUrlContext.Provider>
  )
}

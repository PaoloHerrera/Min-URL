import { createContext } from 'react'
import { useShortUrlReducer } from '../hooks/useShortUrlReducer'

// 1. Create a new context with createContext and export it
export const ShortUrlContext = createContext()

// 2. Create a new provider component that takes children as a prop

export const ShortUrlProvider = ({ children }) => {
  // 3. Create a state to hold the shortUrl
  const shortUrlState = useShortUrlReducer()

  return (
    <ShortUrlContext.Provider value={shortUrlState}>
      {children}
    </ShortUrlContext.Provider>
  )
}

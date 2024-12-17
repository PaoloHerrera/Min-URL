import { createContext, useState } from 'react'

// 1. Create a new context with createContext and export it
export const ShortUrlContext = createContext()

// 2. Create a new provider component that takes children as a prop

export const ShortUrlProvider = ({ children }) => {
  // 3. Create a state to hold the shortUrl
  const [shortUrl, setShortUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  return (
    <ShortUrlContext.Provider value={{
      shortUrl,
      setShortUrl,
      loading,
      setLoading,
      error,
      setError
    }}
    >
      {children}
    </ShortUrlContext.Provider>
  )
}

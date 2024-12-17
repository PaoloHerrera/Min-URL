import { createContext, useState } from 'react'

// 1. Create a new context with createContext and export it
export const UrlContext = createContext()

// 2. Create a new provider component that takes children as a prop

export const UrlProvider = ({ children }) => {
  // 3. Create a state to hold the url and shortUrl
  const [url, setUrl] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)

  return (
    <UrlContext.Provider value={{
      url,
      setUrl,
      isInvalid,
      setIsInvalid
    }}
    >
      {children}
    </UrlContext.Provider>
  )
}

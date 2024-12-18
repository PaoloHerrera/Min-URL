import { createContext } from 'react'
import { useUrlReducer } from '../hooks/useUrlReducer'

// 1. Create a new context with createContext and export it
export const UrlContext = createContext()

// 2. Create a new provider component that takes children as a prop

export const UrlProvider = ({ children }) => {
  // 3. Create a state to hold the url and shortUrl
  const urlState = useUrlReducer()

  return (
    <UrlContext.Provider value={urlState}>
      {children}
    </UrlContext.Provider>
  )
}

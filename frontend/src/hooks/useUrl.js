import { UrlContext } from '../context/url'
import { useContext } from 'react'

export function useUrl () {
  const context = useContext(UrlContext)

  if (context === undefined) {
    throw new Error('useUrl must be used within a UrlProvider')
  }

  return context
}

import { UrlContext } from '../context/url'
import { useContext } from 'react'
import validator from 'validator'

export function useUrl () {
  const { url, setUrl, isInvalid, setIsInvalid } = useContext(UrlContext)

  const validateURL = (url) => {
    if (validator.isURL(url)) {
      setIsInvalid(false)
      return true
    } else {
      setIsInvalid(true)
      return false
    }
  }

  return { url, setUrl, isInvalid, validateURL }
}

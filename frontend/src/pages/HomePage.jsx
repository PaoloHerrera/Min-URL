import React, { useState } from 'react'
import ShortUrlForm from '../components/ShortUrlForm'
import logo from '../assets/Logo-transformed.png'
import LoadingIndicator from '../components/LoadingIndicator'
import ShortUrlReady from '../components/ShortUrlReady'
import axios from 'axios'

export default function HomePage () {
  const [loading, setLoading] = useState(false)
  const [formReady, setFormReady] = useState(true)
  const [shortUrlReady, setShortUrlReady] = useState(false)
  const [urlValue, setUrlValue] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [error, setError] = useState(null)

  const sendUrl = async (url) => {
    setLoading(true)
    setUrlValue(url)
    setError(null)

    try {
      const response = await axios.post('http://localhost:1234/api/urls', {
        originalUrl: url
      })
      setShortUrl(response.data.fullShortUrl)
      setFormReady(false)
      setLoading(false)
      setShortUrlReady(true)
    } catch (error) {
      setError(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  const createNewShortUrl = () => {
    setLoading(false)
    setShortUrlReady(false)
    setUrlValue('')
    setFormReady(true)
  }

  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      { formReady && <ShortUrlForm sendUrl={sendUrl} /> }
      {error && <div className="error-message bg-red-100 text-red-700 p-2 mt-2 rounded">
        <i className="error-icon">⚠️</i> {error}
      </div> }
      { loading && <LoadingIndicator /> }
      { shortUrlReady && <ShortUrlReady url={urlValue} createNewShortUrl={createNewShortUrl} shortURL={shortUrl}/>}
    </header>
  )
}

import React, { useState } from 'react'
import ShortUrlForm from '../components/ShortUrlForm'
import logo from '../assets/Logo-transformed.png'
import LoadingIndicator from '../components/LoadingIndicator'
import ShortUrlReady from '../components/ShortUrlReady'

export default function HomePage () {
  const [loading, setLoading] = useState(false)
  const [formReady, setFormReady] = useState(true)
  const [shortUrlReady, setShortUrlReady] = useState(false)
  const [urlValue, setUrlValue] = useState('')

  const sendUrl = (url) => {
    setLoading(true)
    setUrlValue(url)
    setTimeout(() => {
      setFormReady(false)
      setLoading(false)
      setShortUrlReady(true)
    }, 10000)
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
      { loading && <LoadingIndicator /> }
      { shortUrlReady && <ShortUrlReady url={urlValue} createNewShortUrl={createNewShortUrl}/>}
    </header>
  )
}

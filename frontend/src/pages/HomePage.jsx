import React from 'react'
import ShortUrlForm from '../components/ShortUrlForm'
import logo from '../assets/Logo-transformed.png'

export default function HomePage () {
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <ShortUrlForm />
    </header>
  )
}

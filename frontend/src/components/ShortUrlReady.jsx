import React from 'react'
import { QRCode } from 'react-qr-code'

export default function ShortUrlReady ({ url }) {
  return (
    <>
      <QRCode value={url} size={200}/>
    </>
  )
}

import React, { useRef } from 'react'
import { QRCode } from 'react-qr-code'
import { Button, Card, CardBody, Snippet } from '@nextui-org/react'
import * as htmlToImage from 'html-to-image'
import { useShortUrl } from '../hooks/useShortUrl'
import { useUrl } from '../hooks/useUrl'

export default function ShortUrlReady () {
  const qrCodeRef = useRef(null)
  const { url, setUrl } = useUrl()
  const { shortUrl, setShortUrl } = useShortUrl()

  const handleCreateNewShortUrl = () => {
    setUrl('')
    setShortUrl('')
  }

  // const copyToClipboard = () => {
  //   navigator.clipboard.writeText(shortURL)
  // }

  const downloadQRCode = () => {
    htmlToImage
      .toPng(qrCodeRef.current)
      .then(function (dataUrl) {
        const link = document.createElement('a')
        link.href = dataUrl
        link.download = 'qr-code.png'
        link.click()
      })
      .catch(function (error) {
        console.error('Error to donwloading QR code:', error)
      })
  }

  return (
    <>
      <p className='mt-4 text-left'>
        Your short URL and QR Code is ready! Share it with your friends
      </p>
      <Card
        className='border-none bg-transparent w-full mt-10'
        shadow='md'
        fullWidth
      >
        <CardBody>
          <div className='grid grid-cols-8 sm:grid-cols-12 sm:gap-2'>
            <div className='mb-5 ml-5 mt-5 col-span-3 sm:col-span-4'>
              <p className='text-white'><strong>QR CODE</strong></p>
            </div>
            <div className='mt-5 text-right col-span-9 sm:col-span-8 mr-2'>
              <Button
                className='bg-gradient-to-tr from-blue-500 to-black text-white'
                variant='solid'
                onPress={downloadQRCode}
              >Download PNG
              </Button>
            </div>
            <div className='mb-5 ml-5 col-span-3 sm:col-span-4' ref={qrCodeRef}>
              <QRCode value={url} size={130} />
            </div>
            <div className='col-span-12 items-center sm:col-span-8 mt-5'>
              <div className='grid grid-cols-12 items-center col-span-12 sm:col-span-8 mr-2 sm:gap-2'>
                <div className='col-span-12 sm:col-span-12'>
                  <Snippet symbol='♾️' variant='bordered' color='primary' className='truncate-url w-full text-white' hideCopyButton>{url}</Snippet>
                </div>
              </div>
              <div className='grid grid-cols-12 items-center col-span-12 sm:col-span-8 mr-2 sm:gap-2 mt-3'>
                <div className='col-span-12 sm:col-span-12'>
                  <Snippet symbol='🔗' variant='bordered' color='success' className='w-full text-white'>{shortUrl}</Snippet>
                </div>
              </div>
            </div>

            <div className='col-span-8 justify-self-center sm:col-span-12 mt-10 sm:mt-1'>
              <Button
                className='bg-gradient-to-tr from-green-500 to-black text-white'
                variant='solid'
                onPress={() => handleCreateNewShortUrl()}
              >
                Create a New Short URL
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </>

  )
}

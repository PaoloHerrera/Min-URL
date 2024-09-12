import React, { useRef } from 'react'
import { QRCode } from 'react-qr-code'
import { Button, Card, CardBody, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { faClipboard, faGlobe, faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as htmlToImage from 'html-to-image'

export default function ShortUrlReady ({ url, createNewShortUrl }) {
  const shortURL = 'https://min-url/A43x5'

  const qrCodeRef = useRef(null)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortURL)
  }

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
    <Card
    className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
    shadow="md"
    fullWidth
    >
      <CardBody>
        <div className="grid grid-cols-8 sm:grid-cols-12 sm:gap-2">
          <div className="mb-5 ml-5 mt-5 col-span-3 sm:col-span-4">
            <p><strong>QR CODE</strong></p>
          </div>
          <div className="mt-5 text-right col-span-5 sm:col-span-8 mr-2">
            <Button
              color="primary"
              variant="solid"
              onClick={downloadQRCode}
            >Download PNG
            </Button>
          </div>
          <div className="mb-5 ml-5 col-span-3 sm:col-span-4" ref={qrCodeRef}>
            <QRCode value={url} size={130}/>
          </div>
          <div className="col-span-12 items-center sm:col-span-8 mt-5">
            <div className="grid grid-cols-12 items-center col-span-12 sm:col-span-8 mr-2 sm:gap-2">
              <div className="col-span-1 sm:col-span-2">
                <FontAwesomeIcon icon={faGlobe} className="primary-color" />
              </div>
              <div className="col-span-11 sm:col-span-10">
                <p className="truncate-url">{url}</p>
              </div>
            </div>
            <div className="grid grid-cols-12 items-center col-span-12 sm:col-span-8 mr-2 sm:gap-2">
              <div className="col-span-1 sm:col-span-2">
                <FontAwesomeIcon icon={faLink} className="primary-color" />
              </div>
              <div className="col-span-9 sm:col-span-8">
                <p className="short-url">{shortURL}</p>
              </div>
              <div className="col-span-2 text-right">
                <Popover placement="right">
                  <PopoverTrigger>
                    <Button
                      isIconOnly
                      onClick={copyToClipboard}
                    >
                      <FontAwesomeIcon icon={faClipboard} className="primary-color" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2">
                      <div className="text-small font-bold"> Short URL Copied! </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="col-span-8 justify-self-center sm:col-span-12 mt-10 sm:mt-1">
            <Button
              color="secondary"
              variant="solid"
              onClick={createNewShortUrl}
            >
              Create a New Short URL
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

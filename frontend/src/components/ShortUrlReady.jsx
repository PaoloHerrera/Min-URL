import React from 'react'
import { QRCode } from 'react-qr-code'
import { Button, Card, CardBody } from '@nextui-org/react'
import { faClipboard, faGlobe, faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function ShortUrlReady ({ url, createNewShortUrl }) {
  const shortURL = 'https://min-url/A43x5'

  return (
    <Card
    className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
    shadow="md"
    fullWidth
    >
      <CardBody>
        <div className="grid grid-cols-8 gap-6">
          <div className="mb-5 ml-5 mt-5 col-span-3">
            <p><strong>QR CODE</strong></p>
          </div>
          <div className="mt-5 text-right col-span-5">
            <Button
              color="primary"
              variant="solid"
            >Download PNG
            </Button>
          </div>
          <div className="mb-5 ml-5 col-span-3">
            <QRCode value={url} size={130}/>
          </div>
          <div className="grid grid-cols-12 items-center col-span-5">
            <div className="col-span-2">
              <FontAwesomeIcon icon={faGlobe} className="primary-color" />
            </div>
            <div className="col-span-10">
              <p className="truncate-url">{url}</p>
            </div>
            <div className="col-span-2">
              <FontAwesomeIcon icon={faLink} className="primary-color" />
            </div>
            <div className="col-span-8">
              <p className="short-url">{shortURL}</p>
            </div>
            <div className="col-span-1">
              <Button
                isIconOnly
              >
                <FontAwesomeIcon icon={faClipboard} className="primary-color" />
              </Button>
            </div>
          </div>
          <div className="col-span-8 justify-self-center">
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

import QRCode from 'react-qr-code'
import { useShortUrl } from '@hooks/useShortUrl'

export function QRCodeDisplay ({ qrCodeRef }) {
  const { shortUrl } = useShortUrl()

  return (
    <div className='mb-5 ml-5 col-span-3 sm:col-span-4' ref={qrCodeRef}>
      <QRCode value={shortUrl} size={130} />
    </div>
  )
}

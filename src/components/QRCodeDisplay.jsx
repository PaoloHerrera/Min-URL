import QRCode from 'react-qr-code'
import { useUrl } from '@hooks/useUrl'

export function QRCodeDisplay ({ qrCodeRef }) {
  const { url } = useUrl()
  return (
    <div className='mb-5 ml-5 col-span-3 sm:col-span-4' ref={qrCodeRef}>
      <QRCode value={url} size={130} />
    </div>
  )
}

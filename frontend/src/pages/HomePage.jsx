import { useShortUrl } from '../hooks/useShortUrl'
import logo from '../assets/Logo-transformed.png'
import { Image } from '@nextui-org/react'
import LoadingIndicator from '../components/LoadingIndicator'
import ShortUrlReady from '../components/ShortUrlReady'
import { ShortUrlForm } from '../components/ShortUrlForm'

export default function HomePage () {
  const { shortUrl, loading } = useShortUrl()

  return (
    <main className='flex flex-col items-center justify-center min-h-[50vh] py-2'>
      <Image
        alt='Min-URL Logo'
        src={logo}
        className='pointer-events-none'
        width={600}
      />
      {!shortUrl && <ShortUrlForm />}

      {loading ? <LoadingIndicator /> : shortUrl && <ShortUrlReady />}

    </main>
  )
}

import { useShortUrl } from '@hooks/useShortUrl'
import LoadingIndicator from '@components/LoadingIndicator'
import ShortUrlReady from './ShortUrlReady'
import { ShortUrlForm } from './ShortUrlForm'

export function FormComponent () {
  const { shortUrl, loading } = useShortUrl()
  return (
    <section className='w-full max-w-2xl flex flex-col items-center mt-20 pl-6 pr-6'>
      <h1 className='sm:text-6xl font-bold mt-10 text-left text-3xl'>
        Build stronger links
      </h1>

      {!shortUrl && <ShortUrlForm />}

      {loading ? <LoadingIndicator /> : shortUrl && <ShortUrlReady />}
    </section>
  )
}

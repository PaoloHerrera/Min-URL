import { useShortUrl } from '../hooks/useShortUrl'
import LoadingIndicator from '../components/LoadingIndicator'
import ShortUrlReady from '../components/ShortUrlReady'
import { ShortUrlForm } from '../components/ShortUrlForm'

export default function HomePage () {
  const { shortUrl, loading } = useShortUrl()

  return (
    <article className='flex flex-col items-center py-2 short-url-container pl-6 pr-6'>
      <section className='w-full max-w-2xl flex flex-col items-center mt-10'>
        <h1 className='text-4xl font-bold mt-10 text-left'>
          Build stronger links
        </h1>

        {!shortUrl && <ShortUrlForm />}

        {loading ? <LoadingIndicator /> : shortUrl && <ShortUrlReady />}
      </section>

    </article>
  )
}

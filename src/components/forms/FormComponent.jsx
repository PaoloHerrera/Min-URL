import { useShortUrl } from '@hooks/useShortUrl'
import LoadingIndicator from '@components/LoadingIndicator'
import ShortUrlReady from './ShortUrlReady'
import { ShortUrlForm } from './ShortUrlForm'

export function FormComponent() {
	const { shortUrl, loading } = useShortUrl()
	return (
		<section className='flex flex-col items-center justify-center'>
			<article className="w-full max-w-6xl flex flex-col items-center justify-center pl-6 pr-6 gap-5">
				<h1 className="sm:text-6xl font-bold text-left text-3xl">
					Build stronger links
				</h1>

				{!shortUrl && <ShortUrlForm />}

				{loading ? <LoadingIndicator /> : shortUrl && <ShortUrlReady />}
			</article>
		</section>
	)
}

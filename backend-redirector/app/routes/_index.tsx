import type { MetaFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'

export const meta: MetaFunction = () => {
	return [
		{ title: 'Min-URL - Your URL Shortener' },
		{
			name: 'description',
			content:
				'Min-URL is a URL shortener service that allows you to create short URLs for your websites and social media profiles. It is easy to use and provides a simple and intuitive interface for creating and managing your shortened URLs.',
		},
		{
			name: 'keywords',
			content:
				'url shortener, shortener, url shortening, shortening, url shorten, shorten, url, min-url, min url',
		},
	]
}

export function loader() {
	return redirect('https://min-url.com/')
}

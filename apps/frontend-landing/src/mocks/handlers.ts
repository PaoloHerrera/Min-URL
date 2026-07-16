import { http, HttpResponse } from 'msw'

export const handlers = [
	http.post('*/direct/shorten', () => {
		return HttpResponse.json({
			shortUrl: 'https://murl.cl/abc123',
		})
	}),
]

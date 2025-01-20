const DEV_CONSTANTS = {
	SHORT_URL_API: 'http://localhost:1234/api/urls',
	RECAPTCHA_SITE_KEY: '6LcW5J4qAAAAAAzPPQs8lMfNf_lFopw-qUDxvKni',
}

const PROD_CONSTANTS = {
	SHORT_URL_API: 'https://go.min-url.com/api/urls',
	RECAPTCHA_SITE_KEY: '6LeD4aAqAAAAALwnUkhz9hUnF-hy2zR-6rfvDbJh',
}

export const { SHORT_URL_API, RECAPTCHA_SITE_KEY } =
	process.env.NODE_ENV === 'development' ? DEV_CONSTANTS : PROD_CONSTANTS

export const HOW_MIN_URL_IT_WORKS = [
	{
		id: 1,
		title: '🔗 Enter the URL of the website you want to minify',
		image: '/01.webp',
	},
	{
		id: 2,
		title: '✅ Click the "Minify URL" button',
		image: '/02.webp',
	},
	{
		id: 3,
		title: '⏳ Wait a few seconds for the magic to happen',
		image: '/03.webp',
	},
	{
		id: 4,
		title: '📤 Done! You have a new minified URL and QR Code. Share it!',
		image: '/04.webp',
	},
]

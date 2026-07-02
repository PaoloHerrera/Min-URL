import { describe, expect, it, afterEach, beforeEach, vi } from 'vitest'
import { render, screen, cleanup, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { server } from '@/mocks/server'
import { ShortenerForm } from '@/components/react/ShortenerForm'

vi.mock('canvas-confetti', () => ({
	default: vi.fn(),
}))

const EN_TEXTS = {
	buttonText: 'Shorten',
	loadingText: 'Shortening...',
	errorUrlInvalidText: 'Please enter a valid URL',
	errorShortenFailedText: 'Something went wrong. Please try again later.',
	placeholderText: 'https://example.com',
	successTitleText: 'Your shortened link is ready',
	successSubtitleText: 'Ready to share',
	copiedText: 'Copied!',
	copyText: 'Copy',
	visitText: 'Visit',
	resetText: 'Shorten another link',
}

describe('ShortenerForm', () => {
	afterEach(() => {
		cleanup()
	})

	beforeEach(() => {
		// Window Turnstile mock
		;(window as any).turnstile = {
			render: vi.fn((_container: string | HTMLElement, options: any) => {
				options.callback('mock-turnstile-token')
				return 'mock-widget-id'
			}),

			reset: vi.fn(),
			remove: vi.fn(),
		}
	})

	it('should render the form with correct initial texts', () => {
		render(<ShortenerForm texts={EN_TEXTS} />)
		expect(screen.getByRole('textbox')).toHaveAttribute(
			'placeholder',
			EN_TEXTS.placeholderText,
		)
		expect(screen.getByRole('button')).toHaveTextContent(EN_TEXTS.buttonText)
	})

	it('should allow a user to enter a URL', async () => {
		const user = userEvent.setup()
		render(<ShortenerForm texts={EN_TEXTS} />)
		const urlInput = screen.getByRole('textbox', { name: 'longUrl' })
		await user.type(urlInput, 'https://www.google.com')
		expect(urlInput).toHaveValue('https://www.google.com')
	})

	it('should show error message after debounce if url is not valid', async () => {
		const user = userEvent.setup()
		render(<ShortenerForm texts={EN_TEXTS} />)
		const urlInput = screen.getByRole('textbox', { name: 'longUrl' })
		await user.type(urlInput, 'invalid url')
		expect(
			await screen.findByText(EN_TEXTS.errorUrlInvalidText),
		).toBeInTheDocument()
	})

	it('should be disabled button if url is not valid', async () => {
		const user = userEvent.setup()
		render(<ShortenerForm texts={EN_TEXTS} />)
		const urlInput = screen.getByRole('textbox', { name: 'longUrl' })
		await user.type(urlInput, 'invalid url')
		expect(screen.getByRole('button')).toBeDisabled()
	})

	it('should be enable button when URL is valid', async () => {
		const user = userEvent.setup()
		render(<ShortenerForm texts={EN_TEXTS} />)
		const urlInput = screen.getByRole('textbox', { name: 'longUrl' })
		await user.type(urlInput, 'https://www.google.com')
		expect(screen.getByRole('button')).toBeEnabled()
	})

	it('should show loading state while shortening', async () => {
		server.use(http.post('*/direct/shorten', () => new Promise(() => {})))
		const user = userEvent.setup()
		render(<ShortenerForm texts={EN_TEXTS} />)
		const urlInput = screen.getByRole('textbox', { name: 'longUrl' })
		await user.type(urlInput, 'https://www.google.com')
		expect(screen.getByRole('button')).toBeEnabled()
		await user.click(screen.getByRole('button'))
		expect(screen.getByRole('button')).toBeDisabled()
		expect(screen.getByRole('button')).toHaveTextContent(EN_TEXTS.loadingText)
	})

	it('should display an error message when the API call fails', async () => {
		server.use(
			http.post('*/direct/shorten', () => {
				return HttpResponse.json(
					{ error: 'Failed to shorten URL' },
					{ status: 500 },
				)
			}),
		)
		const user = userEvent.setup()
		render(<ShortenerForm texts={EN_TEXTS} />)
		const urlInput = screen.getByRole('textbox', { name: 'longUrl' })
		await user.type(urlInput, 'https://www.google.com')
		expect(screen.getByRole('button')).toBeEnabled()
		await user.click(screen.getByRole('button'))

		expect(
			await screen.findByText(EN_TEXTS.errorShortenFailedText),
		).toBeInTheDocument()
	})

	it('should display the shortened URL when the API call is successful', async () => {
		server.use(
			http.post('*/direct/shorten', async () => {
				return HttpResponse.json({
					shortUrl: 'https://murl.cl/abc123',
				})
			}),
		)
		const user = userEvent.setup()
		render(<ShortenerForm texts={EN_TEXTS} />)
		const urlInput = screen.getByRole('textbox', { name: 'longUrl' })
		await user.type(urlInput, 'https://www.google.com')
		expect(screen.getByRole('button')).toBeEnabled()
		await user.click(screen.getByRole('button'))

		const shortenedUrl = await screen.findByText('https://murl.cl/abc123')
		expect(shortenedUrl).toBeInTheDocument()
	})

	it('should disappear error message when user type a valid url after a invalid url', async () => {
		const user = userEvent.setup()
		render(<ShortenerForm texts={EN_TEXTS} />)
		const urlInput = screen.getByRole('textbox', { name: 'longUrl' })
		await user.type(urlInput, 'invalid url')
		expect(
			await screen.findByText(EN_TEXTS.errorUrlInvalidText),
		).toBeInTheDocument()
		await user.clear(urlInput)
		await user.type(urlInput, 'https://www.google.com')

		await waitFor(() => {
			expect(
				screen.queryByText(EN_TEXTS.errorUrlInvalidText),
			).not.toBeInTheDocument()
		})
	})

	it('should hide input and button after get a shortened url', async () => {
		server.use(
			http.post('*/direct/shorten', async () => {
				return HttpResponse.json({
					shortUrl: 'https://murl.cl/abc123',
				})
			}),
		)
		const user = userEvent.setup()
		render(<ShortenerForm texts={EN_TEXTS} />)
		const urlInput = screen.getByRole('textbox', { name: 'longUrl' })
		await user.type(urlInput, 'https://www.google.com')
		expect(screen.getByRole('button')).toBeEnabled()
		await user.click(screen.getByRole('button'))
		await waitFor(() => {
			expect(
				screen.queryByRole('textbox', { name: 'longUrl' }),
			).not.toBeInTheDocument()
		})

		await waitFor(() => {
			expect(
				screen.queryByRole('button', { name: 'shorten' }),
			).not.toBeInTheDocument()
		})
	})

	it('should show reset button after get a shortened url', async () => {
		server.use(
			http.post('*/direct/shorten', async () => {
				return HttpResponse.json({
					shortUrl: 'https://murl.cl/abc123',
				})
			}),
		)
		const user = userEvent.setup()
		render(<ShortenerForm texts={EN_TEXTS} />)
		const urlInput = screen.getByRole('textbox', { name: 'longUrl' })
		await user.type(urlInput, 'https://www.google.com')
		expect(screen.getByRole('button')).toBeEnabled()
		await user.click(screen.getByRole('button'))

		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'reset' })).toBeInTheDocument()
		})
	})

	it('should show copy button after get a shortened url', async () => {
		server.use(
			http.post('*/direct/shorten', async () => {
				return HttpResponse.json({
					shortUrl: 'https://murl.cl/abc123',
				})
			}),
		)
		const user = userEvent.setup()
		render(<ShortenerForm texts={EN_TEXTS} />)
		const urlInput = screen.getByRole('textbox', { name: 'longUrl' })
		await user.type(urlInput, 'https://www.google.com')
		expect(screen.getByRole('button')).toBeEnabled()
		await user.click(screen.getByRole('button'))

		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'copy' })).toBeInTheDocument()
		})
	})

	it('should copy the shortened url to the clipboard', async () => {
		server.use(
			http.post('*/direct/shorten', async () => {
				return HttpResponse.json({
					shortUrl: 'https://murl.cl/abc123',
				})
			}),
		)
		const user = userEvent.setup()
		render(<ShortenerForm texts={EN_TEXTS} />)
		const urlInput = screen.getByRole('textbox', { name: 'longUrl' })
		await user.type(urlInput, 'https://www.google.com')
		expect(screen.getByRole('button')).toBeEnabled()
		await user.click(screen.getByRole('button'))

		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'copy' })).toBeInTheDocument()
		})

		await user.click(screen.getByRole('button', { name: 'copy' }))

		const clipboardText = await navigator.clipboard.readText()
		expect(clipboardText).toBe('https://murl.cl/abc123')
	})

	it('should reset form after click reset button', async () => {
		server.use(
			http.post('*/direct/shorten', async () => {
				return HttpResponse.json({
					shortUrl: 'https://murl.cl/abc123',
				})
			}),
		)
		const user = userEvent.setup()
		render(<ShortenerForm texts={EN_TEXTS} />)
		const urlInput = screen.getByRole('textbox', { name: 'longUrl' })
		await user.type(urlInput, 'https://www.google.com')
		expect(screen.getByRole('button', { name: 'shorten' })).toBeEnabled()
		await user.click(screen.getByRole('button', { name: 'shorten' }))

		await waitFor(() => {
			expect(screen.getByRole('button', { name: 'reset' })).toBeInTheDocument()
		})

		await user.click(screen.getByRole('button', { name: 'reset' }))

		expect(
			screen.queryByRole('textbox', { name: 'longUrl' }),
		).toBeInTheDocument()
		expect(
			screen.queryByRole('button', { name: 'shorten' }),
		).toBeInTheDocument()
		expect(screen.getByRole('textbox', { name: 'longUrl' })).toHaveValue('')
		expect(screen.getByRole('button', { name: 'shorten' })).toBeDisabled()
	})

	it('should body contain turnstile token', async () => {
		let requestBody: any = null
		server.use(
			http.post('*/direct/shorten', async ({ request }) => {
				requestBody = await request.json()
				return HttpResponse.json({
					shortUrl: 'https://murl.cl/abc123',
				})
			}),
		)
		const user = userEvent.setup()
		render(<ShortenerForm texts={EN_TEXTS} />)
		const urlInput = screen.getByRole('textbox', { name: 'longUrl' })
		await user.type(urlInput, 'https://www.google.com')
		expect(screen.getByRole('button', { name: 'shorten' })).toBeEnabled()
		await user.click(screen.getByRole('button', { name: 'shorten' }))

		await screen.findByText('https://murl.cl/abc123')

		expect(requestBody).toHaveProperty('turnstileToken', 'mock-turnstile-token')
	})

	it('should keep the submit button disabled until turnstile is resolved', async () => {
		// Overwrite global turnstile render to not trigger the callback immediately
		let triggerTurnstileCallback: (token: string) => void = () => {}
		;(window as any).turnstile.render = vi.fn((_container, options) => {
			triggerTurnstileCallback = options.callback
			return 'mock-widget-id'
		})

		const user = userEvent.setup()
		render(<ShortenerForm texts={EN_TEXTS} />)

		// Type valid URL
		const urlInput = screen.getByRole('textbox', { name: 'longUrl' })
		await user.type(urlInput, 'https://www.google.com')

		// Button should be disabled because Turnstile hasn't resolved
		const submitButton = screen.getByRole('button', { name: 'shorten' })
		expect(submitButton).toBeDisabled()

		// Trigger Turnstile callback manually
		act(() => {
			triggerTurnstileCallback('manual-mock-token')
		})

		// Now the button should be enabled
		expect(submitButton).toBeEnabled()
	})
})

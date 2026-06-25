import { describe, expect, it, afterEach } from 'vitest'
import { render, screen, cleanup, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { server } from '@/mocks/server'
import { ShortenerForm } from '@/components/react/ShortenerForm'

describe('ShortenerForm', () => {
	afterEach(() => {
		cleanup()
	})

	it('should render the form', () => {
		render(<ShortenerForm />)
	})

	it('should allow a user to enter a URL', async () => {
		const user = userEvent.setup()
		render(<ShortenerForm />)
		const urlInput = screen.getByRole('textbox', { name: 'longUrl' })
		await user.type(urlInput, 'https://www.google.com')
		expect(urlInput).toHaveValue('https://www.google.com')
	})

	it('should show error message after debounce if url is not valid', async () => {
		const user = userEvent.setup()
		render(<ShortenerForm />)
		const urlInput = screen.getByRole('textbox', { name: 'longUrl' })
		await user.type(urlInput, 'invalid url')
		expect(
			await screen.findByText('Please enter a valid URL'),
		).toBeInTheDocument()
	})

	it('should be disabled button if url is not valid', async () => {
		const user = userEvent.setup()
		render(<ShortenerForm />)
		const urlInput = screen.getByRole('textbox', { name: 'longUrl' })
		await user.type(urlInput, 'invalid url')
		expect(screen.getByRole('button')).toBeDisabled()
	})

	it('should be enable button when URL is valid', async () => {
		const user = userEvent.setup()
		render(<ShortenerForm />)
		const urlInput = screen.getByRole('textbox', { name: 'longUrl' })
		await user.type(urlInput, 'https://www.google.com')
		expect(screen.getByRole('button')).toBeEnabled()
	})

	it('should show loading state while shortening', async () => {
		server.use(http.post('*/direct/shorten', () => new Promise(() => {})))
		const user = userEvent.setup()
		render(<ShortenerForm />)
		const urlInput = screen.getByRole('textbox', { name: 'longUrl' })
		await user.type(urlInput, 'https://www.google.com')
		expect(screen.getByRole('button')).toBeEnabled()
		await user.click(screen.getByRole('button'))
		expect(screen.getByRole('button')).toBeDisabled()
		expect(screen.getByRole('button')).toHaveTextContent('Shortening...')
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
		render(<ShortenerForm />)
		const urlInput = screen.getByRole('textbox', { name: 'longUrl' })
		await user.type(urlInput, 'https://www.google.com')
		expect(screen.getByRole('button')).toBeEnabled()
		await user.click(screen.getByRole('button'))

		expect(
			await screen.findByText('Something went wrong. Please try again later.'),
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
		render(<ShortenerForm />)
		const urlInput = screen.getByRole('textbox', { name: 'longUrl' })
		await user.type(urlInput, 'https://www.google.com')
		expect(screen.getByRole('button')).toBeEnabled()
		await user.click(screen.getByRole('button'))

		expect(
			await screen.findByText('https://murl.cl/abc123'),
		).toBeInTheDocument()
	})

	it('should disappear error message when user type a valid url after a invalid url', async () => {
		const user = userEvent.setup()
		render(<ShortenerForm />)
		const urlInput = screen.getByRole('textbox', { name: 'longUrl' })
		await user.type(urlInput, 'invalid url')
		expect(
			await screen.findByText('Please enter a valid URL'),
		).toBeInTheDocument()
		await user.clear(urlInput)
		await user.type(urlInput, 'https://www.google.com')

		await waitFor(() => {
			expect(
				screen.queryByText('Please enter a valid URL'),
			).not.toBeInTheDocument()
		})
	})
})

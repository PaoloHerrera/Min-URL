import { expect, test } from '@playwright/test'

// TypeScript global declaration
declare global {
	interface Window {
		turnstile?: {
			render: (
				container: string | HTMLElement,
				options: {
					sitekey: string
					callback: (token: string) => void
					'expired-callback'?: () => void
					'error-callback'?: () => void
				},
			) => string
			reset: (id?: string) => void
			remove: (id?: string) => void
		}
	}
}

const REDIRECTOR_URL = process.env.REDIRECTOR_URL || 'localhost:3002'
const TARGET_URL = 'https://www.google.com'

test.describe('Anonymous URL Shortener E2E', () => {
	// 1. COLD START SOLUTION: It runs once before any test in the describe block
	test.beforeAll(async ({ browser }) => {
		const context = await browser.newContext()
		const page = await context.newPage()

		// Give 2 minutes for Vite to start the monorepo and compile the first time
		test.setTimeout(120000)
		console.log(
			'⏳ Warming up the development server and optimizing dependencies...',
		)

		await page.goto('/')
		await page
			.getByRole('textbox', { name: 'longUrl' })
			.waitFor({ state: 'attached' })
		await context.close()
	})

	// 2. ABSTRACTION: Configure mocks of Turnstile and browser console logs before each test
	test.beforeEach(async ({ page }) => {
		// Capture browser logs
		page.on('console', (msg) =>
			console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`),
		)
		page.on('pageerror', (err) =>
			console.error(`[Browser PageError] ${err.message}`),
		)

		// Mock Cloudflare Turnstile
		await page.route('**/turnstile/v0/api.js*', (route) => route.abort())
		await page.addInitScript(() => {
			window.turnstile = {
				render: (_, options) => {
					options.callback('mock-turnstile-token')
					return 'mock-widget-id'
				},
				reset: () => undefined,
				remove: () => undefined,
			}
		})
	})

	// 3. THE TEST: Now it is clean, direct and uses the standard timeouts of Playwright
	test('Should successfully create a shortened URL anonymously and redirect correctly', async ({
		page,
	}) => {
		await page.goto('/')

		// Shortening form
		const input = page.getByRole('textbox', { name: 'longUrl' })
		await expect(input).toBeVisible()
		await input.fill(TARGET_URL)

		const submitButton = page.getByRole('button', { name: 'shorten' })
		await expect(submitButton).toBeVisible()
		await expect(submitButton).toBeEnabled()
		await submitButton.click()

		// Results verification
		const successPanel = page.getByTestId('success-panel')
		await expect(successPanel).toBeVisible()

		const shortUrlElement = page.getByLabel('shortUrl')
		await expect(shortUrlElement).toBeVisible()
		await expect(shortUrlElement).not.toBeEmpty()

		const shortUrl = await shortUrlElement.textContent()
		expect(shortUrl).toContain(REDIRECTOR_URL)

		// Redirection and final inspection
		const cleanShortUrl = shortUrl?.trim().startsWith('http')
			? shortUrl.trim()
			: `http://${shortUrl?.trim()}`

		await page.goto(cleanShortUrl)
		await expect(page).toHaveURL(new RegExp(TARGET_URL))
	})
})

import { expect, test } from '@playwright/test'

const REDIRECTOR_URL = process.env.REDIRECTOR_URL || 'localhost:3002'

test.describe('Anonymous URL Shortener E2E', () => {
	test('should successfully create a shortened URL anonymously', async ({
		page,
	}) => {
		//1. Navigate to the landing page
		await page.goto('/')

		//2. Locate the input field and fill it with the long URL to shorten
		const input = page.getByRole('textbox', { name: 'longUrl' })
		await expect(input).toBeVisible()
		await input.fill('https://www.google.com')

		//3. Locate the shorten button and click it
		const submitButton = page.getByRole('button', { name: 'shorten' })
		await expect(submitButton).toBeVisible()
		await submitButton.click()

		//4. Check that success panel is visible
		const successPanel = page.getByTestId('success-panel')
		await expect(successPanel).toBeVisible()

		//5. Extract the short URL and that it is not empty
		const shortUrlElement = page.getByLabel('shortUrl')
		await expect(shortUrlElement).toBeVisible()
		await expect(shortUrlElement).not.toBeEmpty()
		const shortUrl = await shortUrlElement.textContent()

		//6. Check that the URL contains the domain name
		await expect(shortUrl).toContain(REDIRECTOR_URL)

		console.log(`✅ The long URL was successfully shortened: ${shortUrl}`)
	})
})

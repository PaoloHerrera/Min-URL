import { Injectable } from '@nestjs/common'

@Injectable()
export class ProtectedService {
	async getData(_userId: string, _accessToken: string) {
		// TODO: Refactor dashboard stats with Drizzle in Parte 1B
		await Promise.resolve()
		return {
			basicStats: [
				{
					total_clicks: 0,
					today_clicks: 0,
					today_clicks_variation: 0,
					active_links: 0,
					unique_clicks_percentage: 0,
					unique_clicks_variation: 0,
				},
			],
			last7DaysClicks: [],
			topDevices: [],
			topBrowsers: [],
			topCountries: [],
			urls: [],
		}
	}

	async checkSlug(_slug: string): Promise<boolean> {
		await Promise.resolve()
		return true
	}

	async createShortUrl(
		_data: Record<string, unknown>,
	): Promise<Record<string, unknown>> {
		await Promise.resolve()
		return {
			success: true,
			originalUrl: '',
			shortUrl: '',
			createdAt: new Date().toISOString(),
		}
	}

	async createQrCode(
		_data: Record<string, unknown>,
	): Promise<Record<string, unknown>> {
		await Promise.resolve()
		return { success: true }
	}

	async deleteUrl(_userId: string, _id: string) {
		await Promise.resolve()
		return { success: true }
	}

	async updateUrl(
		_userId: string,
		_id: string,
		_data: Record<string, unknown>,
	) {
		await Promise.resolve()
		return { success: true }
	}
}

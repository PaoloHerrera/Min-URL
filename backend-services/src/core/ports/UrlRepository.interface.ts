export interface UrlData {
	id_urls: string
	long_url: string
	purpose: 'direct' | 'qr' | 'api'
	slug: string
	password?: boolean
	expired?: boolean
	created_at: Date
	deleted?: boolean
}

export interface UrlRepository {
	createAnonymous(
		originalUrl: string,
		slug: string,
		geoId: string,
	): Promise<UrlData>

	isSlugAvailable: (slug: string) => Promise<boolean>

	getUrlBySlug: (slug: string) => Promise<UrlData | null>
}

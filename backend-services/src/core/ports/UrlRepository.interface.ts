export interface Url {
	id_urls: string
	long_url: string
	purpose: 'direct' | 'qr' | 'api'
	slug: string
	created_at: Date
}

export interface UrlRepository {
	createAnonymous(
		originalUrl: string,
		slug: string,
		geoId: string,
	): Promise<Url>

	isSlugAvailable: (slug: string) => Promise<boolean>
}

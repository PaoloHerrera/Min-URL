export interface SlugGenerator {
	generateUniqueSlug(originalUrl: string): Promise<string>
}

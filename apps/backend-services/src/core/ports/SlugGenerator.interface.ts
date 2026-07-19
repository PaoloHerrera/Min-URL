import type { TargetUrl } from '../domain/value-objects/target-url/TargetUrl.vo.ts'

export interface SlugGenerator {
	generateUniqueSlug(originalUrl: TargetUrl): Promise<string>
}

import type { TargetUrl } from '@/core/domain/value-objects/target-url/TargetUrl.vo.ts'

export interface SlugGeneratorPort {
	generateUniqueSlug(originalUrl: TargetUrl): Promise<string>
}

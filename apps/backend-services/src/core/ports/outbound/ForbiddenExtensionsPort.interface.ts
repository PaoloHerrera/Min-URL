import type { TargetUrl } from '@/core/domain/value-objects/target-url/TargetUrl.vo.ts'

export interface ForbiddenExtensionsPort {
	check(url: TargetUrl): boolean
}

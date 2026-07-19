import type { TargetUrl } from '../domain/value-objects/target-url/TargetUrl.vo.ts'

export interface ForbiddenExtensions {
	check(url: TargetUrl): boolean
}

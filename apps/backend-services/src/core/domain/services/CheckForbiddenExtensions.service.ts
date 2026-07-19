import type { TargetUrl } from '../../domain/value-objects/target-url/TargetUrl.vo.ts'
import type { ForbiddenExtensions } from '../../ports/ForbiddenExtensions.interface.ts'

export class CheckForbiddenExtension implements ForbiddenExtensions {
	private readonly forbiddenExtensions: string[]

	constructor(forbiddenExtensions: string[]) {
		this.forbiddenExtensions = forbiddenExtensions
	}

	check(url: TargetUrl): boolean {
		try {
			const urlPath = new URL(url.value).pathname
			const lastPart = urlPath.split('/').pop()
			const extension = lastPart?.includes('.')
				? `.${lastPart.split('.').pop()}`
				: ''
			return this.forbiddenExtensions.includes(`${extension}`.toLowerCase())
		} catch (_error) {
			return true
		}
	}
}

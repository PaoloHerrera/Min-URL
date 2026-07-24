import type { TargetUrl } from '@/core/domain/value-objects/target-url/TargetUrl.vo.ts'
import type { ForbiddenExtensionsPort } from '@/core/ports/outbound/ForbiddenExtensionsPort.interface.ts'

export class CheckForbiddenExtensions implements ForbiddenExtensionsPort {
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

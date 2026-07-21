import { describe, expect, it } from 'vitest'
import { CheckForbiddenExtensions } from '@/core/domain/services/CheckForbiddenExtensions.service.ts'
import { FORBIDDEN_EXTENSIONS } from '@/config/constants.ts'
import { TargetUrl } from '@/core/domain/value-objects/target-url/TargetUrl.vo.ts'

describe('CheckForbiddenExtension Domain Service', () => {
	const service = new CheckForbiddenExtensions(FORBIDDEN_EXTENSIONS)

	it('should return false for secure, standard URLs without files', () => {
		expect(service.check(TargetUrl.create('https://www.google.com'))).toBe(
			false,
		)
		expect(
			service.check(
				TargetUrl.create('https://github.com/PaoloHerrera/Min-URL'),
			),
		).toBe(false)
	})

	it('should return true for forbidden extensions in lowercase', () => {
		expect(
			service.check(TargetUrl.create('https://example.com/malicious-file.exe')),
		).toBe(true)
		expect(
			service.check(TargetUrl.create('https://example.com/script.sh')),
		).toBe(true)
		expect(
			service.check(TargetUrl.create('https://example.com/installer.msi')),
		).toBe(true)
	})

	it('should return true for forbidden extensions in UPPERCASE (case insensitivity)', () => {
		expect(
			service.check(TargetUrl.create('https://example.com/MALICIOUS-FILE.EXE')),
		).toBe(true)
		expect(
			service.check(TargetUrl.create('https://example.com/SCRIPT.SH')),
		).toBe(true)
	})

	it('should return false for allowed extensions', () => {
		expect(
			service.check(TargetUrl.create('https://example.com/index.php')),
		).toBe(false)
		expect(
			service.check(TargetUrl.create('https://example.com/styles/main.css')),
		).toBe(false)
		expect(
			service.check(TargetUrl.create('https://example.com/images/logo.png')),
		).toBe(false)
	})
})

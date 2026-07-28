export interface CaptchaServicePort {
	verify(token: string): Promise<boolean>
}

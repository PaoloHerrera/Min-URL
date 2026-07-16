export interface CaptchaServices {
	verify(token: string): Promise<boolean>
}

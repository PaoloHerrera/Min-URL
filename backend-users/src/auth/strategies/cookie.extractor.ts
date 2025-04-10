import type { Request } from 'express'
import { ACCESS_TOKEN_COOKIE_NAME } from '@/constants'

export const cookieExtractor = (req: Request) => {
	return req.cookies[ACCESS_TOKEN_COOKIE_NAME]
}

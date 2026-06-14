import { ACCESS_TOKEN_COOKIE_NAME } from '@/constants'
import type { Request } from 'express'

export const cookieExtractor = (req: Request) => {
	return req.cookies[ACCESS_TOKEN_COOKIE_NAME]
}

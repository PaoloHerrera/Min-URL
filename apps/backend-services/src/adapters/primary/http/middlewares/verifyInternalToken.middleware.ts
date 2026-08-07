import crypto from 'node:crypto'

import { INTERNAL_TOKEN_ERROR_RESPONSES } from '@min-url/contracts/errors'
import type { NextFunction, Request, Response } from 'express'

const REGEX_HEADER_SPLIT = /\s+/
const SCHEME = 'bearer'

export const createVerifyInternalTokenMiddleware = (secret: string) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const [scheme, token, ...extra] =
			req.headers.authorization?.trim().split(REGEX_HEADER_SPLIT) ?? []

		if (!(scheme && token)) {
			return res.status(401).json(INTERNAL_TOKEN_ERROR_RESPONSES.missingHeader)
		}

		if (
			scheme.toLowerCase() !== SCHEME ||
			extra.length > 0 ||
			token.trim().length === 0
		) {
			return res.status(401).json(INTERNAL_TOKEN_ERROR_RESPONSES.invalidHeader)
		}

		const hashToken = crypto.createHash('sha256').update(token).digest()
		const hashSecret = crypto.createHash('sha256').update(secret).digest()

		if (!crypto.timingSafeEqual(hashToken, hashSecret)) {
			return res.status(401).json(INTERNAL_TOKEN_ERROR_RESPONSES.invalidHeader)
		}

		next()
	}
}

import crypto from 'node:crypto'

import type { NextFunction, Request, Response } from 'express'

export const createVerifyInternalTokenMiddleware = (secret: string) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const token = req.headers.authorization?.split(' ')[1]

		if (!token || token.trim().length === 0) {
			return res.status(401).json({ message: 'Authorization header missing' })
		}

		const hashToken = crypto.createHash('sha256').update(token).digest()
		const hashSecret = crypto.createHash('sha256').update(secret).digest()

		if (!crypto.timingSafeEqual(hashToken, hashSecret)) {
			return res
				.status(401)
				.json({ message: 'Invalid or malformed Authorization header' })
		}

		next()
	}
}

import { env } from '@/config/env.ts'
export const verifyInternalToken = createVerifyInternalTokenMiddleware(
	env.INTERNAL_SECRET,
)

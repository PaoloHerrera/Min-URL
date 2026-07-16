import type { NextFunction, Request, Response } from 'express'

export const verifyInternalToken = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const secret = process.env.INTERNAL_SECRET
	const token = req.headers.authorization?.split(' ')[1]

	if (!token) {
		return res.status(401).json({ message: 'Authorization header missing' })
	}
	if (token !== secret) {
		return res
			.status(401)
			.json({ message: 'Invalid or malformed Authorization header' })
	}
	next()
}

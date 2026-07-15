import type { NextFunction, Request, Response } from 'express'
import z from 'zod'
const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const validateSlug = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const slugSchema = z.string().regex(new RegExp(`^[${BASE62}]+$`))
	const slug = req.params.slug
	const result = slugSchema.safeParse(slug)

	if (!result.success) {
		return res.status(400).json({ message: 'Invalid slug format' })
	}

	if (slug.length < 6 || slug.length > 12) {
		return res.status(400).json({ message: 'Invalid slug format' })
	}

	next()
}

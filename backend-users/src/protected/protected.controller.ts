import {
	Controller,
	Get,
	Post,
	Request,
	Response,
	Inject,
	UseGuards,
	Delete,
	Patch,
} from '@nestjs/common'
import type {
	Response as ExpressResponse,
	Request as ExpressRequest,
} from 'express'
import { Throttle } from '@nestjs/throttler'
import { AuthGuard } from '@nestjs/passport'
import { ProtectedService } from './protected.service'
import { ACCESS_TOKEN_COOKIE_NAME } from '@/constants'

interface AuthenticatedUser {
	userId: string
	username: string
}

@Controller('protected')
export class ProtectedController {
	@Inject(ProtectedService) private protectedService: ProtectedService

	@Get('dashboard-stats')
	@UseGuards(AuthGuard('jwt'))
	async protected(
		@Request() req: ExpressRequest,
		@Response() res: ExpressResponse,
	) {
		const user = req.user as AuthenticatedUser

		//recuperamos el access token

		if (!user) {
			return res.status(401).json({ message: 'No autorizado' })
		}

		const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME] as string
		const userId = user.userId

		const data = await this.protectedService.getData(userId, accessToken)

		return res.status(200).json(data)
	}

	@Throttle({ default: { limit: 30, ttl: 60000 } })
	@Post('check-slug')
	@UseGuards(AuthGuard('jwt'))
	async checkSlug(
		@Request() req: ExpressRequest,
		@Response() res: ExpressResponse,
	) {
		const user = req.user as AuthenticatedUser

		if (!user) {
			return res.status(401).json({ message: 'No autorizado' })
		}

		const slug = req.body.slug as string

		const isAvailable = await this.protectedService.checkSlug(slug)
		return res.status(200).json({ slug, isAvailable })
	}

	@Post('create-short-url')
	@UseGuards(AuthGuard('jwt'))
	async createShortUrl(
		@Request() req: ExpressRequest,
		@Response() res: ExpressResponse,
	) {
		const user = req.user as AuthenticatedUser

		if (!user) {
			return res.status(401).json({ message: 'No autorizado' })
		}

		const title = req.body.title as string
		const url = req.body.url as string
		const customSlug = req.body.customSlug as boolean
		const slug = req.body.slug as string

		const { originalUrl, shortUrl, createdAt } =
			await this.protectedService.createShortUrl({
				ip: req.ip as string,
				title,
				userId: user.userId,
				originalUrl: url,
				customSlug,
				slug,
			})
		return res.status(200).json({ originalUrl, shortUrl, slug, createdAt })
	}

	@Post('create-qr-code')
	@UseGuards(AuthGuard('jwt'))
	async createQrCode(
		@Request() req: ExpressRequest,
		@Response() res: ExpressResponse,
	) {
		const user = req.user as AuthenticatedUser

		if (!user) {
			return res.status(401).json({ message: 'No autorizado' })
		}

		const ip = req.ip as string
		const title = req.body.title as string
		const url = req.body.url as string
		const foregroundColor = req.body.foregroundColor as string
		const backgroundColor = req.body.backgroundColor as string

		const qrCode = await this.protectedService.createQrCode({
			ip,
			title,
			userId: user.userId,
			originalUrl: url,
			foregroundColor,
			backgroundColor,
		})
		return res.status(200).json({ ...qrCode, title })
	}

	@Delete('delete-url/:id')
	@UseGuards(AuthGuard('jwt'))
	async deleteUrl(
		@Request() req: ExpressRequest,
		@Response() res: ExpressResponse,
	) {
		const user = req.user as AuthenticatedUser

		if (!user) {
			return res.status(401).json({ message: 'No autorizado' })
		}

		const id = req.params.id as string

		await this.protectedService.deleteUrl(user.userId, id)

		return res.status(200).json({ message: 'Link eliminado' })
	}

	@Patch('update-url/:id')
	@UseGuards(AuthGuard('jwt'))
	updateUrl(@Request() req: ExpressRequest, @Response() res: ExpressResponse) {
		const user = req.user as AuthenticatedUser

		if (!user) {
			return res.status(401).json({ message: 'No autorizado' })
		}

		const id = req.params.id as string
		const title = req.body.title as string
		const url = req.body.url as string

		return res
			.status(409)
			.json({ message: 'Error updating link. Please try again later.' })
		// return res.status(200).json({ id, title, url })

		// const { originalUrl, shortUrl, createdAt } =
		// 	await this.protectedService.updateUrl(user.userId, id, {
		// 		title,
		// 		originalUrl: url,
		// 		clicks,
		// 	})
	}
}

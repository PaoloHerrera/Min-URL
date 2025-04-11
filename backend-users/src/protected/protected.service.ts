import { Injectable, HttpException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { User } from '../user/model/user.model'
import axios from 'axios'
import { QueryTypes } from 'sequelize'

@Injectable()
export class ProtectedService {
	private userModel: typeof User
	constructor(@InjectModel(User) userModel: typeof User) {
		this.userModel = userModel
	}

	async getData(userId: string, accessToken: string) {
		const user = await this.userModel.findOne({
			where: { idUsers: userId },
		})

		const basicStats = await this.userModel.sequelize?.query<{
			total_clicks: number
			today_clicks: number
			today_clicks_variation: number
			active_links: number
			unique_clicks_percentage: number
			unique_clicks_variation: number
		}>(
			`
				SELECT total_clicks, today_clicks, today_clicks_variation, active_links, unique_clicks_percentage, unique_clicks_variation
				FROM "Min-URL".dashboard_cards_view
				WHERE user_id = :userId
			`,
			{ replacements: { userId }, type: QueryTypes.SELECT },
		)

		const last7DaysClicks = await this.userModel.sequelize?.query<{
			total_clicks: number
			day_created_at: string
		}>(
			`
				SELECT total_clicks, day_created_at
				FROM "Min-URL".dashboard_last_7_days_clicks_view
				WHERE user_id = :userId
			`,
			{ replacements: { userId }, type: QueryTypes.SELECT },
		)

		const countryStats = await this.userModel.sequelize?.query<{
			total_clicks: number
			country: string
		}>(
			`
				SELECT total_clicks, country
				FROM "Min-URL".dashboard_countries_view
				WHERE user_id = :userId AND total_clicks > 0
			`,
			{ replacements: { userId }, type: QueryTypes.SELECT },
		)

		const deviceStats = await this.userModel.sequelize?.query<{
			total_clicks: number
			device_type: string
		}>(
			`
				SELECT total_clicks, device_type
				FROM "Min-URL".dashboard_devices_view
				WHERE user_id = :userId AND total_clicks > 0
			`,
			{ replacements: { userId }, type: QueryTypes.SELECT },
		)

		const topLinks = await this.userModel.sequelize?.query<{
			total_clicks: number
			title: string
			long_url: string
			slug: string
			created_at: string
		}>(
			`
				SELECT total_clicks, title, long_url, slug, created_at
				FROM "Min-URL".dashboard_top_links_view
				WHERE user_id = :userId
				ORDER BY total_clicks DESC
				LIMIT 3
			`,
			{ replacements: { userId }, type: QueryTypes.SELECT },
		)

		const topQrCodes = await this.userModel.sequelize?.query<{
			total_scans: number
			title: string
			long_url: string
			slug: string
			foreground_color: string
			background_color: string
			created_at: string
		}>(
			`
				SELECT total_scans, title, long_url, slug, foreground_color, background_color, created_at
				FROM "Min-URL".dashboard_top_qr_codes_view
				WHERE user_id = :userId
				ORDER BY total_scans DESC
				LIMIT 3
			`,
			{ replacements: { userId }, type: QueryTypes.SELECT },
		)

		// Datos del usuario
		const userData = {
			displayName: user?.displayName,
			givenName: user?.givenName,
			familyName: user?.familyName,
			email: user?.email,
			avatar: user?.avatar,
			shortUrlUsage: user?.shortUrlUsage,
			shortUrlAvailable: user?.shortUrlAvailable,
			qrCodeUsage: user?.qrCodeUsage,
			qrCodeAvailable: user?.qrCodeAvailable,
			accessToken,
		}

		//Stats KPIs
		const basicStatsData = {
			totalClicks: {
				total: basicStats?.[0]?.total_clicks ?? 0,
			},
			todayClicks: {
				total: basicStats?.[0]?.today_clicks ?? 0,
				percentage: basicStats?.[0]?.today_clicks_variation ?? 0,
			},
			activeLinks: {
				total: basicStats?.[0]?.active_links ?? 0,
			},
			percentageUniqueClicks: {
				total: basicStats?.[0]?.unique_clicks_percentage ?? 0,
				percentage: basicStats?.[0]?.unique_clicks_variation ?? 0,
			},
		}

		//Stats Clicks de los últimos 7 días
		const last7DaysClicksData = last7DaysClicks?.map((last7DaysClick) => ({
			clicks: last7DaysClick.total_clicks ?? 0,
			createdAt: new Date(last7DaysClick.day_created_at).toLocaleDateString(
				'es-ES',
				{
					year: 'numeric',
					month: 'numeric',
					day: 'numeric',
				},
			),
		}))

		//Stats Países
		const countryStatsData = countryStats?.map((country) => ({
			name: country.country,
			clicks: Number(country.total_clicks),
			percent: basicStats
				? Math.round((country.total_clicks / basicStats[0].total_clicks) * 100)
				: 0,
		}))

		//Stats Dispositivos
		const deviceStatsData = deviceStats?.map((device) => ({
			name: device.device_type,
			clicks: Number(device.total_clicks),
			percent: basicStats
				? Math.round((device.total_clicks / basicStats[0].total_clicks) * 100)
				: 0,
		}))

		//Stats Links cortos
		const topLinksData = topLinks?.map((link) => ({
			title: link.title,
			clicks: Number(link.total_clicks),
			shortUrl: `${process.env.REDIRECTOR_URL}/${link.slug}`,
			slug: link.slug,
			longUrl: link.long_url,
			createdAt: link.created_at,
		}))

		//Stats QR Codes
		const topQrCodesData = topQrCodes?.map((qrCode) => ({
			scans: Number(qrCode.total_scans),
			title: qrCode.title,
			url: qrCode.long_url,
			shortUrl: `${process.env.REDIRECTOR_URL}/${qrCode.slug}`,
			slug: qrCode.slug,
			foregroundColor: qrCode.foreground_color,
			backgroundColor: qrCode.background_color,
			createdAt: qrCode.created_at,
		}))

		const data = {
			user: userData,
			basicStats: basicStatsData,
			last7DaysClicks: last7DaysClicksData,
			countryStats: countryStatsData,
			deviceStats: deviceStatsData,
			topLinks: topLinksData,
			topQrCodes: topQrCodesData,
		}

		return data
	}

	async checkSlug(slug: string): Promise<boolean> {
		try {
			const response = await axios.post(
				`${process.env.API_URL}/protected/check-slug`,
				{
					slug,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						'X-API-Key': `${process.env.API_KEY}`,
					},
				},
			)

			return response.data.isAvailable
		} catch (err) {
			if (err.response) {
				//Error HTTP desde el backend de servicios
				throw new HttpException(err.response.data.message, err.response.status)
			}
			//Error de conexión
			throw new HttpException('generic', 500)
		}
	}

	async createShortUrl(
		ip: string,
		title: string,
		userId: string,
		url: string,
		customSlug: boolean,
		slug: string,
	) {
		try {
			const endpoint = customSlug
				? '/protected/create-short-url-with-custom-slug'
				: '/protected/create-short-url'

			const response = await axios.post(
				`${process.env.API_URL}${endpoint}`,
				{
					userId,
					title,
					originalUrl: url,
					customSlug,
					slug,
				},
				{
					headers: {
						'X-Forwarded-For': ip,
						'Content-Type': 'application/json',
						'X-API-Key': `${process.env.API_KEY}`,
					},
				},
			)
			return response.data
		} catch (err) {
			if (err.response) {
				//Error HTTP desde el backend de servicios
				throw new HttpException(err.response.data.message, err.response.status)
			}
			//Error de conexión
			throw new HttpException('Error al crear short URL', 500)
		}
	}

	async createQrCode(data: {
		ip: string
		title: string
		userId: string
		originalUrl: string
		foregroundColor: string
		backgroundColor: string
	}) {
		try {
			const response = await axios.post(
				`${process.env.API_URL}/protected/create-qr-code`,
				data,
				{
					headers: {
						'Content-Type': 'application/json',
						'X-API-Key': `${process.env.API_KEY}`,
					},
				},
			)
			return response.data
		} catch (err) {
			if (err.response) {
				//Error HTTP desde el backend de servicios
				throw new HttpException(err.response.data.message, err.response.status)
			}
			//Error de conexión
			throw new HttpException('Error al crear QR Code', 500)
		}
	}
}

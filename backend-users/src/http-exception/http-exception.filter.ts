import type { ExceptionFilter, ArgumentsHost } from '@nestjs/common'
import { Catch, HttpException } from '@nestjs/common'
import type { Response } from 'express'

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
	catch(exception: T, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()
		const status =
			exception instanceof HttpException ? exception.getStatus() : 500

		const errorResponse = {
			status,
			error:
				exception instanceof Error
					? exception.message
					: 'Internal Server Error',
			timestamp: new Date().toISOString(),
		}

		response.status(status).json(errorResponse)
	}
}

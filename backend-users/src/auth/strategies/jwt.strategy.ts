import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'
import { cookieExtractor } from './cookie.extractor'

interface JwtPayload {
	sub: string
	username: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: cookieExtractor,
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET as string,
		})
	}

	validate(payload: JwtPayload) {
		return { userId: payload.sub, username: payload.username }
	}
}

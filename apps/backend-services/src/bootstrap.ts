// Primary adapters
import { UrlController } from '@/adapters/primary/http/controllers/url.controller.ts'
import { createVerifyCaptchaMiddleware } from '@/adapters/primary/http/middlewares/verifyCaptcha.middleware.ts'
import { createVerifyInternalTokenMiddleware } from '@/adapters/primary/http/middlewares/verifyInternalToken.middleware.ts'
import { TurnstileCaptchaService } from '@/adapters/secondary/captcha/TurnstileCaptchaService'
import { DrizzleShortUrlRepository } from '@/adapters/secondary/db/DrizzleShortUrlRepository.ts'
import { DrizzleVisitRepository } from '@/adapters/secondary/db/DrizzleVisitRepository.ts'
import { GeoIpLiteResolver } from '@/adapters/secondary/geoip/GeoIpLiteResolver.ts'
// Config
import type { Db } from '@/adapters/secondary/db/connection.ts'
import { FORBIDDEN_EXTENSIONS, SHORTURL_VALUES } from '@/config/constants.ts'
import type { Env } from '@/config/env.ts'
// Core
import { CheckForbiddenExtensions } from '@/core/domain/services/CheckForbiddenExtensions.service.ts'
import { RandomBase62SlugGenerator } from '@/core/domain/services/RandomBase62SlugGenerator.service.ts'
import { ShortenUrlAnonymous } from '@/core/usecases/ShortenUrlAnonymous.usecase.ts'
import { VisitShortUrl } from '@/core/usecases/VisitShortUrl.usecase.ts'

export const bootstrap = (env: Env, db: Db) => {
	// 1. Secondary adapters — infrastructure (repositories, external services)
	const shortUrlRepository = new DrizzleShortUrlRepository(db)
	const visitRepository = new DrizzleVisitRepository(db)
	const captchaService = new TurnstileCaptchaService(env.TURNSTILE_SECRET_KEY)

	// 2. Domain services — pure business logic, no I/O
	const slugGenerator = new RandomBase62SlugGenerator(shortUrlRepository, {
		initialLength: SHORTURL_VALUES.initialLength,
		maxLength: SHORTURL_VALUES.maxLength,
		maxAttempts: SHORTURL_VALUES.maxAttempts,
	})
	const forbiddenExtensions = new CheckForbiddenExtensions(FORBIDDEN_EXTENSIONS)
	const ipGeolocationResolver = new GeoIpLiteResolver()

	// 3. Use cases — application layer, orchestrates domain + secondary adapters
	const shortenUrlAnonymousUseCase = new ShortenUrlAnonymous({
		shortUrlRepository,
		slugGenerator,
		forbiddenExtensions,
		ipGeolocationResolver,
	})
	const visitShortUrlUseCase = new VisitShortUrl(
		shortUrlRepository,
		visitRepository,
	)

	// 4. Primary adapters — HTTP controllers and middlewares (inbound)
	const urlController = new UrlController(
		shortenUrlAnonymousUseCase,
		visitShortUrlUseCase,
		env.REDIRECTOR_URL,
	)
	const verifyCaptchaMiddleware = createVerifyCaptchaMiddleware(captchaService)
	const verifyInternalTokenMiddleware = createVerifyInternalTokenMiddleware(
		env.INTERNAL_SECRET,
	)

	return {
		urlController,
		verifyCaptchaMiddleware,
		verifyInternalTokenMiddleware,
	}
}

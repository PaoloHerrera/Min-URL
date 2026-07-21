import { UrlController } from '@/adapters/primary/http/controllers/url.controller.ts'
import { TurnstileCaptchaService } from '@/adapters/secondary/captcha/TurnstileCaptchaService.ts'
import { DrizzleShortUrlRepository } from '@/adapters/secondary/db/DrizzleShortUrlRepository.ts'
import { GeoIpLiteResolver } from '@/adapters/secondary/geoip/GeoIpLiteResolver.ts'
import { FORBIDDEN_EXTENSIONS, SHORTURL_VALUES } from '@/config/constants.ts'
import { CheckForbiddenExtensions } from '@/core/domain/services/CheckForbiddenExtensions.service.ts'
import { RandomBase62SlugGenerator } from '@/core/domain/services/RandomBase62SlugGenerator.service.ts'
import { ShortenUrlAnonymous } from '@/core/usecases/ShortenUrlAnonymous.usecase.ts'
import { VisitShortUrl } from '@/core/usecases/VisitShortUrl.usecase.ts'

// 1. Instanciar Adaptadores Secundarios (Infraestructura)
const shortUrlRepository = new DrizzleShortUrlRepository()
const captchaServices = new TurnstileCaptchaService()

// 2. Instanciar Servicios del Core / Dominio
const slugGenerator = new RandomBase62SlugGenerator(shortUrlRepository, {
	initialLength: SHORTURL_VALUES.initialLength,
	maxLength: SHORTURL_VALUES.maxLength,
	maxAttempts: SHORTURL_VALUES.maxAttempts,
})
const forbiddenExtensions = new CheckForbiddenExtensions(FORBIDDEN_EXTENSIONS)
const ipGeolocationResolver = new GeoIpLiteResolver()

// 3. Instanciar Casos de Uso (Aplicación)
const shortenUrlAnonymousUseCase = new ShortenUrlAnonymous({
	shortUrlRepository,
	captchaServices,
	slugGenerator,
	forbiddenExtensions,
	ipGeolocationResolver,
})

const visitShortUrlUseCase = new VisitShortUrl(shortUrlRepository)

// 4. Instanciar e Inyectar el Adaptador Primario (HTTP / Controller)
export const urlController = new UrlController(
	shortenUrlAnonymousUseCase,
	visitShortUrlUseCase,
)

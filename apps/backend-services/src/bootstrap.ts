import { SHORTURL_VALUES } from '../constants.js'
import { UrlController } from './adapters/primary/http/controllers/url.controller.ts'
import { TurnstileCaptchaService } from './adapters/secondary/captcha/TurnstileCaptchaService.ts'
import { SequelizeGeolocationService } from './adapters/secondary/db/SequelizeGeolocationService.ts'
import { SequelizeUrlRepository } from './adapters/secondary/db/SequelizeUrlRepository.ts'
import { GeoIpLiteResolver } from './adapters/secondary/geoip/GeoIpLiteResolver.ts'
import { RandomBase62SlugGenerator } from './core/services/RandomBase62SlugGenerator.ts'
import { ResolveSlugRedirectUseCase } from './core/usecases/resolveSlugRedirect.usecase.ts'
import { ShortenUrlAnonymousUseCase } from './core/usecases/shortenUrlAnonymous.usecase.ts'

// 1. Instanciar Adaptadores Secundarios (Infraestructura)
const urlRepository = new SequelizeUrlRepository()
const geolocationRepository = new SequelizeGeolocationService()
const ipResolver = new GeoIpLiteResolver()
const captchaServices = new TurnstileCaptchaService()

// 2. Instanciar Servicios del Core / Dominio
const slugGenerator = new RandomBase62SlugGenerator(urlRepository, {
	initialLength: SHORTURL_VALUES.initialLength,
	maxLength: SHORTURL_VALUES.maxLength,
	maxAttempts: SHORTURL_VALUES.maxAttempts,
})

// 3. Instanciar Casos de Uso (Aplicación)
const shortenUrlAnonymousUseCase = new ShortenUrlAnonymousUseCase({
	urlRepository,
	captchaServices,
	geolocationRepository,
	slugGenerator,
	ipResolver,
})

const resolveSlugRedirectUseCase = new ResolveSlugRedirectUseCase(urlRepository)

// 4. Instanciar e Inyectar el Adaptador Primario (HTTP / Controller)
export const urlController = new UrlController(
	shortenUrlAnonymousUseCase,
	resolveSlugRedirectUseCase,
)

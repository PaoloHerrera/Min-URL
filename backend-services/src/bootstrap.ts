import { UrlController } from './adapters/primary/http/Url.controller.js'
import { TurnstileCaptchaService } from './adapters/secondary/captcha/TurnstileCaptchaService.js'
import { SequelizeGeolocationService } from './adapters/secondary/db/SequelizeGeolocationService.js'
import { SequelizeUrlRepository } from './adapters/secondary/db/SequelizeUrlRepository.js'
import { RandomBase62SlugGenerator } from './core/services/RandomBase62SlugGenerator.js'
import { ShortenUrlAnonymousUseCase } from './core/usecases/ShortenUrlAnonymous.usecase.js'

//1. Slug Configuration

const slugConfig = {
	initialLength: Number(process.env.SLUG_INITIAL_LENGTH) || 6,
	maxLength: Number(process.env.SLUG_MAX_LENGTH) || 12,
	maxAttempts: Number(process.env.SLUG_MAX_ATTEMPTS) || 3,
}

//2. Secondary Adapters Initialization
const urlRepository = new SequelizeUrlRepository()
const captchaService = new TurnstileCaptchaService()
const geolocationService = new SequelizeGeolocationService()

//3. Domain Services Initialization
const slugGenerator = new RandomBase62SlugGenerator(urlRepository, slugConfig)

//4. Use Cases Initialization (Dependency Injection)
const shortenUrlAnonymousUseCase = new ShortenUrlAnonymousUseCase(
	urlRepository,
	captchaService,
	geolocationService,
	slugGenerator,
)

//5. Export Controller: Ready for use
export const urlController = new UrlController(shortenUrlAnonymousUseCase)

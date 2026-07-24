# Plan de Refactor — Min-URL

> Última actualización: 2026-07-15
> Estado: Aprobado — Pendiente de implementación

---

## Visión General

Min-URL es un acortador de URLs con analíticas en tiempo semi-real, organizado como un monorepo de 5 paquetes (3 backends + 2 frontends) con Turborepo.

El proyecto se estructura en **4 capítulos** de implementación, donde cada capítulo construye sobre el anterior:

1. **El MVP** — Completar los 6 casos de uso con arquitectura limpia
2. **El Choque con la Realidad** — Observabilidad y pruebas de carga con K6
3. **La Optimización Guiada por Métricas** — Mejoras incrementales basadas en datos
4. **Deploy y Seguridad** — Puesta en producción

---

## Capítulo 1: El MVP (Mínimo Viable y Seguro)

### Parte 1A — CU1 + CU2

**Alcance:** Solo `frontend-landing`, `backend-redirector`, `backend-services`.

**Reglas:** Sin Redis, sin auth. Incluye Click Tracking y Geolocalización de forma síncrona directa a PostgreSQL (enfoque inicial ingenuo / Naive DB Sync Tracking, para benchmarking posterior en Capítulos 2 y 3).

| #   | Paso                        | Estado | Descripción                                                                                                                                                  |
| --- | --------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0   | Monorepo Restructure        | ✅     | Crear carpeta `/apps/`, mover los 5 servicios allí, actualizar root `package.json` (`apps/*`, `packages/*`) y CI paths                                       |
| 1   | Shared contracts            | 🚀     | Crear `/packages/contracts` con tipos DTO, respuestas, códigos de error y schemas Zod compartidos.                                                           |
| 2   | CU1 hexagonal & Drizzle     | ✅     | Reorganizar carpetas en `src/`, migrar `app.js`, `index.js` y middlewares a TS, e integrar Drizzle ORM.                                                      |
| 3   | CU2 hexagonal & Tracking    | ⏳     | `VisitShortUrl` → resuelve IP/Geolocalización y registra analítica (`visits` table, `clicksCount`) síncronamente en PostgreSQL → `/internal/slug-data/:slug` |
| 4   | Refactor backend-redirector | ⏳     | Aplicar Alt 1 (Thin Handler + RedirectionService) consumiendo `@min-url/contracts` y dando soporte a REST HTTP 410.                                          |
| 5   | Consumo frontend-landing    | ⏳     | Actualizar `frontend-landing` para consumir `@min-url/contracts` y conectar al backend.                                                                      |
| 6   | Tests unitarios             | ✅     | Contratos + schemas (Todos los unitarios de core/middlewares están verdes)                                                                                   |
| 7   | Tests integración CU1       | ✅     | POST /direct/shorten con Turnstile mockeado y validación de entrada Zod                                                                                      |
| 8   | Tests integración CU2       | ✅     | GET /internal/slug-data/:slug — success, 404, password, expired, deleted (REST Semántico)                                                                    |
| 9   | E2E Playwright              | ⏳     | Shorten + redirect end-to-end                                                                                                                                |
| 10  | Eliminar legacy             | ✅     | Eliminar carpetas legacy y archivos sueltos en la raíz (`routes/`, `controllers/`, `services/`, `middleware/`, `config/`)                                    |
| 11  | TS strict                   | ✅     | `strict: true` en backend-services y configuración de NodeNext/bundler ESM                                                                                   |
| 12  | Documentación               | ✅     | README, ADRs, Mermaid diagrams, Swagger/OpenAPI 3.0 (YAML) en `/api-docs` en backend-services                                                                |
| 13  | Dockerfiles                 | ⏳     | Multi-stage para los 3 servicios                                                                                                                             |
| 14  | docker-compose              | ✅     | 3 servicios + PostgreSQL (PostgreSQL dockerizado corriendo en local/test)                                                                                    |

#### Estructura de Carpetas Ejecutada (`backend-services/src/`)

```text
backend-services/src/
├── index.ts                           # Entrypoint de inicialización (Bun/Node)
├── app.ts                             # Instanciación y config de Express
├── bootstrap.ts                       # Raíz de composición (Inyección de Dependencias)
├── config/
│   └── constants.ts                   # Constantes globales del microservicio
├── core/
│   ├── domain/
│   │   ├── entities/                  # Entidades puras de dominio
│   │   │   └── ShortUrl.entity.ts
│   │   ├── value-objects/             # Objetos de Valor autovalidados (DDD)
│   │   │   ├── Geolocation.vo.ts
│   │   │   ├── IpAddress.vo.ts
│   │   │   ├── Password.vo.ts
│   │   │   ├── Slug.vo.ts
│   │   │   └── TargetUrl.vo.ts
│   │   ├── errors/                    # Excepciones de negocio tipadas
│   │   │   └── domain.errors.ts
│   │   └── services/                  # Servicios de Dominio
│   │       ├── CheckForbiddenExtensions.service.ts
│   │       ├── RandomBase62SlugGenerator.service.ts
│   │       └── base62.utils.ts        # Algoritmo de codificación Base62
│   ├── ports/                         # Interfaces de puertos (Hexagonal)
│   │   ├── CaptchaServices.interface.ts
│   │   ├── ForbiddenExtensions.interface.ts
│   │   ├── IpGeolocationResolver.interface.ts
│   │   ├── ShortUrlRepository.interface.ts
│   │   └── SlugGenerator.interface.ts
│   └── usecases/                      # Casos de uso (Capa de Aplicación)
│       ├── ShortenUrlAnonymous.usecase.ts
│       └── VisitShortUrl.usecase.ts
└── adapters/
    ├── primary/                       # Adaptadores de Entrada (HTTP/Express)
    │   └── http/
    │       ├── controllers/
    │       │   └── url.controller.ts
    │       ├── routes/                # Enrutadores Express en TS
    │       │   ├── shorturl.route.ts
    │       │   └── internal.route.ts
    │       └── middlewares/           # Middlewares técnicos (CORS, centralización de errores)
    │           ├── cors.middleware.ts
    │           ├── errorHandler.middleware.ts
    │           └── verifyInternalToken.middleware.ts
    └── secondary/                     # Adaptadores de Salida (Infraestructura/Externos)
        ├── captcha/
        │   └── TurnstileCaptchaService.ts
        └── db/
            ├── connection.ts          # Inicialización de pg.Pool y Drizzle client
            ├── DrizzleShortUrlRepository.ts # Implementación de ShortUrlRepository
            ├── mappers/               # Mapeo bidireccional físico <-> dominio
            │   └── short-url.mapper.ts
            └── schema/                # Esquemas físicos de tablas Drizzle
                ├── short-urls.schema.ts
                └── visits.schema.ts
```

#### Flujo CU1 — Acortar anónimo (Ejecutado)

```
1. Usuario ingresa URL en frontend-landing
2. Turnstile resuelve captcha → token
3. POST /direct/shorten { originalUrl, captchaToken/turnstileToken }
4. backend-services:
   a. Controller recibe los parámetros del cuerpo e IP del cliente (ip, x-forwarded-for o remoteAddress).
   b. Controller invoca a ShortenUrlAnonymousUseCase.execute():
      - CaptchaServices.verify() valida token con la API de Cloudflare.
      - CheckForbiddenExtensions.isForbidden() valida si el dominio posee extensiones de archivos bloqueadas.
      - IpGeolocationResolver.resolve() obtiene país, región, ciudad, latitud y longitud por IP externa.
      - Valida sintaxis de URL de forma estricta a través del constructor del Value Object TargetUrl.vo.ts.
      - SlugGenerator genera un slug base62 único mediante colisiones controladas criptográficas.
      - ShortUrlRepository.save() realiza un upsert atómico de la entidad ShortUrl en Postgres mediante Drizzle.
   c. Devuelve 200 OK con { originalUrl, shortUrl, slug, createdAt }
5. Frontend muestra pantalla de éxito con la URL acortada
```

#### Flujo CU2 — Redirect (Ejecutado con REST Semántico)

```
1. Usuario visita backend-redirector/:slug
2. backend-redirector realiza una petición interna para resolver el slug:
   GET /internal/slug-data/:slug
   - Cabecera: Authorization: Bearer <INTERNAL_SECRET>
3. backend-services:
   a. verifyInternalToken middleware valida la cabecera del token.
   b. Controller invoca VisitShortUrlUseCase.execute({ slug }).
   c. El caso de uso consulta al repositorio.
      - Si el slug no existe → Lanza SlugNotFoundError (HTTP 404 - SLUG_NOT_FOUND)
      - Si el slug está eliminado lógicamente → Lanza SlugIsDeletedError (HTTP 410 Gone - SLUG_IS_DELETED)
      - Si el slug ha expirado → Lanza SlugIsExpiredError (HTTP 410 Gone - SLUG_IS_EXPIRED)
      - Si el slug requiere contraseña → Devuelve HTTP 200 con { slug, password: true } (ocultando originalUrl)
      - Si el slug es público y activo → Devuelve HTTP 200 con { slug, password: false, originalUrl }
   d. Cualquier excepción es interceptada por errorHandler.middleware.ts para mapear los códigos HTTP y JSON correspondientes.
4. backend-redirector captura el resultado:
   - Si recibe HTTP 200 con password=true → 302 a frontend-landing/password-protected
   - Si recibe HTTP 200 con password=false → HTTP 302 Found → originalUrl
   - Si recibe HTTP 410 con SLUG_IS_EXPIRED → Renderiza pantalla "Enlace Expirado"
   - Si recibe HTTP 410 con SLUG_IS_DELETED → Renderiza pantalla "Enlace Eliminado"
   - Si recibe HTTP 404 o cualquier otro → Renderiza pantalla pública de error 404
```

---

### Parte 1B — CU3 a CU6

**Alcance:** `backend-users`, `frontend-dashboard`, integración con los servicios ya refactorizados.

| #   | Paso                     | Descripción                                  |
| --- | ------------------------ | -------------------------------------------- |
| 15  | better-auth              | Integrar como módulo NestJS en backend-users |
| 16  | Google OAuth             | Migrar a better-auth                         |
| 17  | Registro                 | Email/password + verificación de email       |
| 18  | Login local              | Implementar con better-auth                  |
| 19  | Fix seguridad            | Eliminar accessToken del JSON response       |
| 20  | Fix CORS                 | CORS explícito en backend-users              |
| 21  | CU5                      | Crear URL autenticado (proxy)                |
| 22  | CU6                      | Dashboard analytics (6 vistas SQL)           |
| 23  | CU2 upgrade              | Tracking síncrono de clicks                  |
| 24  | Tests backend-users      | Tests reales (no stubs)                      |
| 25  | Tests frontend-dashboard | Componentes críticos                         |
| 26  | E2E auth flow            | Playwright: auth, CRUD                       |

---

## Capítulo 2: El Choque con la Realidad (K6 + Observabilidad)

| #   | Paso           | Descripción                                                                 |
| --- | -------------- | --------------------------------------------------------------------------- |
| 27  | Prometheus     | `prom-client` en backend-redirector y backend-services                      |
| 28  | Health checks  | Endpoints `/metrics` y `/health`                                            |
| 29  | Logging        | Structured logging con Pino en Express                                      |
| 30  | Correlación    | Request ID que viaje entre servicios                                        |
| 31  | Infra medición | docker-compose.loadtest.yml (K6 + Prometheus + Grafana + Loki + Promtail)   |
| 32  | K6 viral       | URL viral (1 slug, rampa a 10K VUs)                                         |
| 33  | K6 spread      | URLs distribuidas (10K slugs, 1K VUs)                                       |
| 34  | K6 create      | Creación masiva (POST /direct/shorten)                                      |
| 35  | K6 rate limit  | Rate limiting (5K+ RPS)                                                     |
| 36  | Constraints    | Resource limits (1 core, 500MB RAM)                                         |
| 37  | Baseline       | Capturar métricas antes de cualquier fix                                    |
| 38  | Redis Streams  | Agregar para click tracking asíncrono (reemplazar síncrono)                 |
| 39  | Experimento    | Medir sync vs async (con Redis Streams) click tracking                      |
| 40  | Dashboards     | Grafana: RPS, latency P50/P95/P99, errors, event loop, DB pool, memory, CPU |

---

## Capítulo 3: La Optimización Guiada por Métricas

**Cada iteración: medir → bottleneck → fix → re-medir → ADR**

| #   | Iteración         | Bottleneck              | Solución                                                                  |
| --- | ----------------- | ----------------------- | ------------------------------------------------------------------------- |
| 41  | Cache             | Redirect sin caché      | LRU cache en memoria para slugs hot                                       |
| 42  | Pool              | DB pool = 5 (default)   | Pool configurable, testear 10/20/50                                       |
| 43  | Env               | `safeParse` por request | Mover a startup                                                           |
| 44  | Middleware        | Overhead innecesario    | Separar rutas internas                                                    |
| 45  | HTTP              | fetch() sin keep-alive  | Connection pooling                                                        |
| 46  | Framework         | Express vs Fastify      | Medir diferencia real                                                     |
| 47  | gRPC              | Transport overhead      | Benchmark vs HTTP                                                         |
| 48  | Documentación     | Cada decisión           | ADRs de cada optimización                                                 |
| 49  | ADR Redis Streams | Mensajería              | Documentar por qué Redis Streams sobre Kafka/RabbitMQ para click tracking |

---

## Capítulo 4: Deploy y Seguridad

| #   | Paso                | Descripción                                                              |
| --- | ------------------- | ------------------------------------------------------------------------ |
| 49  | Rate limiting       | Express rate limiting                                                    |
| 50  | DDoS                | Cloudflare DNS (plan gratuito)                                           |
| 51  | Headers             | Helmet en Express                                                        |
| 52  | CORS                | Explícito en todos los servicios                                         |
| 53  | VPS setup           | Configurar VPS (Hetzner/DigitalOcean) con Docker + Docker Compose        |
| 54  | Docker Compose prod | Compose con los 3 backends + PostgreSQL + Redis + Nginx (reverse proxy)  |
| 55  | Frontend deploy     | Cloudflare Pages (frontend-landing + frontend-dashboard)                 |
| 56  | Nginx               | Reverse proxy con SSL (Let's Encrypt), routing por dominio/path          |
| 57  | Env vars            | Variables de entorno en la VPS (no en código)                            |
| 58  | Monitoreo           | Grafana Cloud conectado a métricas de la VPS via Prometheus remote write |
| 59  | Health checks       | Health checks en todos los servicios + watchdog                          |
| 60  | Backup              | pg_dump automático + cronjob en VPS                                      |
| 61  | Documentación final | README premium con diagrama, métricas, arquitectura, decisiones          |
| 62  | Blog post           | Artículo de ingeniería con resultados del lab                            |

---

## Dependencias

```
Parte 1A (CU1+CU2)
  │
  ├──► Parte 1B (CU3-CU6)
  │         │
  │         ├──► Cap 2 (Observabilidad)
  │                   │
  │                   ├──► Cap 3 (Optimización + ADRs)
  │                             │
  │                             └──► Cap 4 (Deploy VPS + Seguridad)
  │
  └──► Cap 2 (contratos ya definidos)
```

---

## Decisiones Técnicas Clave

| Decisión             | Elección                | Justificación                                                                                               |
| -------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------- |
| Auth library         | better-auth (en NestJS) | TypeScript-first, email/password nativo, plugins para 2FA/passkeys, más moderno que Passport manual         |
| ORM                  | Drizzle ORM             | SQL-first, tipado nativo de JSONB, liviano para Bun y alineado al rediseño del ADR 004.                     |
| Zod version          | 3.23.x unificado        | Estable, soporte amplio, compatible con fastify-type-provider-zod                                           |
| Click tracking Cap 1 | Síncrono (sin Redis)    | Simplificar MVP, medir impacto en Cap 2                                                                     |
| Click tracking Cap 2 | Redis Streams           | Comparar sync vs async usando colas de eventos (Streams) como experimento                                   |
| Shared package       | `@min-url/contracts`    | Tipos y schemas compartidos entre todos los packages                                                        |
| Mensajería           | Redis Streams           | Suficiente para click tracking. Kafka/RabbitMQ sería overkill para este volumen. ADR documenta la decisión. |
| gRPC                 | Experimento en Cap 3    | Medir si la diferencia justifica la complejidad                                                             |
| Deploy               | VPS + Docker            | Control total, infra real, más barato que cloud. Docker demuestra containerización completa.                |
| API docs             | Swagger/OpenAPI         | `@nestjs/swagger` genera docs interactivas automáticamente. Lo piden Factor IT y ACL Tecnología.            |

---

## Stack Tecnológico

| Componente         | Tecnología                          | Versión          |
| ------------------ | ----------------------------------- | ---------------- |
| Monorepo           | Turborepo                           | 2.4.4            |
| Package manager    | Bun                                 | 1.2.9+           |
| Linter             | Biome                               | 1.9.4            |
| Backend core       | Express                             | 5.x              |
| Backend auth       | NestJS + better-auth                | 11.x             |
| Backend redirector | Fastify                             | 5.x              |
| Frontend dashboard | React + Vite + TanStack Query       | 19.x / 8.x / 5.x |
| Frontend landing   | Astro + React + Tailwind v4         | 6.x / 19.x / 4.x |
| ORM                | Drizzle ORM                         | latest           |
| DB                 | PostgreSQL                          | 16               |
| Cache/Queue        | Redis (Streams & Cache)             | latest           |
| Testing            | Vitest + Playwright                 | latest           |
| Load testing       | K6                                  | latest           |
| Observabilidad     | OpenTelemetry + Prometheus          | latest           |
| Logs & Tracing     | Grafana + Loki + Tempo + Promtail   | latest           |
| Validation         | Zod                                 | 3.23.x           |
| API docs           | Swagger/OpenAPI (`@nestjs/swagger`) | latest           |
| Reverse proxy      | Nginx                               | latest           |
| Frontend deploy    | Cloudflare Pages                    | free tier        |
| VPS                | Hetzner/DigitalOcean                | $5-6 USD/mes     |

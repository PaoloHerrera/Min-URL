# Auditoría Técnica del Repositorio — Min-URL

> **Fecha:** 2026-07-25
> **Autor:** Paolo Herrera (auditoría asistida por IA como herramienta de análisis)
> **Estado:** Completada — Remediación en curso (ver [Tracker](#8-tracker-de-remediación))
> **Alcance:** Los 6 paquetes del monorepo, infraestructura raíz, documentación e historial git completo.

---

## 1. Contexto y Método

Revisión de salud técnica del monorepo contra su documentación rectora (`docs/plan_refactor.md` + ADRs 001-005) y contra estándares básicos de producción, con dos preguntas centrales:

1. ¿El código cumple lo que la documentación promete?
2. ¿Dónde está la deuda técnica y de seguridad, y cómo se prioriza su remediación?

### Dimensiones de revisión

Arquitectura (límites hexagonales, dirección de dependencias) · tests (cobertura real, tipo de tests) · seguridad (secretos, auth, validación, inyección) · coherencia documentación-código · infraestructura y CI/CD.

> **Nota metodológica:** no se asignan puntajes numéricos a los módulos. Sin una rúbrica definida de antemano, un número sería arbitrario e indefendible. En su lugar se reportan **hechos verificables** (conteos, comportamientos comprobados, ubicaciones exactas) y **estados** (✅ sólido · 🔧 parcial · 🚧 legacy) con su evidencia.

### Método

- Lectura completa de la documentación (plan, 5 ADRs, README, docs auxiliares).
- Análisis exhaustivo del código de los 6 paquetes y la configuración raíz (estructura, imports, tests, configs).
- Auditoría de seguridad dedicada con verificación empírica (comportamiento real de `z.url()` en Zod 4, historial git con `git log -S` para buscar secretos, `git check-ignore` para archivos sensibles).
- Verificación de estado de tests (`vitest run` en paquetes clave) y typecheck (`tsc --noEmit`).

---

## 2. Estado por Módulo

| Módulo                    | Estado           | Resumen con evidencia                                                                                   |
| ------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------- |
| `apps/backend-services`   | ✅ Sólido        | Hexagonal verificado a nivel de imports; dominio rico; ~89 tests; deuda puntual identificada            |
| `packages/contracts`      | ✅ Sólido        | Shared kernel correcto; faltan tests propios y versionado                                               |
| `apps/frontend-landing`   | 🔧 Parcial       | Migración Astro completa con 38 tests; falta consumo de contracts y página `/password-protected`        |
| `apps/backend-redirector` | 🔧 Parcial       | Fastify migrado con 11 tests; paso 4 del plan incompleto (410, contracts, servicio)                     |
| Testing & QA (global)     | 🔧 Parcial       | ~138 tests reales en 3 paquetes; E2E roto en CI; 2 paquetes sin tests                                   |
| Documentación (global)    | 🔧 Parcial       | ADRs consistentes y honestos; README y docs auxiliares quedaron obsoletos (corregido en esta iteración) |
| Infra & CI/CD             | 🔧 Parcial       | CI sólido con healthchecks; workflow E2E roto; cero Dockerfiles                                         |
| `apps/frontend-dashboard` | 🚧 Legacy        | UI completa contra API legacy; stack divergente del plan; sin tests                                     |
| Seguridad (global)        | 🔧 Parcial       | Controles correctos en código nuevo; 2 hallazgos críticos en scaffold legacy                            |
| `apps/backend-users`      | 🚧 Legacy (mock) | Scaffold sin DB, identidad fija, servicios stub; rebuild planificado (Parte 1B)                         |

### 2.1 `apps/backend-services` — ✅ Sólido

**Fortalezas (con evidencia):**

- **Hexagonal genuino, verificado a nivel de imports:** cero referencias a `express`, `drizzle-orm`, `pg` o `geoip-lite` dentro de `src/core/`. Las dependencias fluyen estrictamente hacia adentro; solo `zod` aparece en VOs (decisión declarada y justificada en ADR-002).
- **Entidad rica, no anémica** (`ShortUrl.entity.ts`): comportamiento real (`delete()`, `restore()`, `isExpired()`, `isDeleted()`, `setPassword()`) con mantenimiento de `updatedAt`; fábricas `create()` (uuidv7) vs `reconstitute()` bien diferenciadas.
- **VOs autovalidados de verdad:** `TargetUrl` rechaza esquemas `javascript:`/`ftp:`; `Password` usa **scrypt + salt aleatorio + `crypto.timingSafeEqual`**; `Geolocation` con invariante lat/lng; `IpAddress` con centinela `'unknown'`.
- **Manejo de errores semántico ejemplar** (`errorHandler.middleware.ts`): 404 `SlugNotFound`, 410 expired/deleted, 503 slug agotado, 500 genérico sin fugar stack traces.
- **Persistencia segura:** `DrizzleShortUrlRepository` 100% parametrizado (sin SQL crudo); migración SQL coherente con el schema Drizzle.
- **Generador de slugs con entropía real:** `randomUUID()` de `node:crypto` → SHA-256 → base62, con reintentos, incremento de longitud (6→12) y error tipado al agotar. `CheckForbiddenExtensions` es fail-closed.
- **~89 tests reales** (no stubs): unitarios con mocks estructurales de puertos (sin `vi.mock` de archivos) e integración con DB de test recreada en `globalSetup` vía `drizzle-kit migrate`.
- Swagger/OpenAPI 3.0 coherente con la API real; `strict: true`; Express 5.2.1.

**Debilidades principales:**

- Bug latente de orden de carga de dotenv (`app.ts:25`): los imports evalúan `connection.ts` y `TurnstileCaptchaService` antes de `dotenv.config()`. **Solo funciona porque Bun auto-carga `.env`**; bajo Node/tsx el pool quedaría con `connectionString: ''`.
- `verifyInternalToken` compara con `!==` (no timing-safe) — irónico: `Password.verify` sí usa `timingSafeEqual`.
- `expirationDate` es campo zombie: `isExpired()` solo mira `expiredAt`.
- Sin rate limiting ni helmet (planificados en Cap 4, pero el ADR-003 declara el rate limiting "no negociable" para `verify-password`).
- `req.body.ip` tiene prioridad sobre headers → spoofing de geolocalización; `trust proxy: true` sin whitelist.
- Código muerto/forward-looking: `LIMITS_VALUES`, `REDIRECTOR_URL`, métodos de entidad sin uso fuera de tests.

### 2.2 `packages/contracts` — ✅ Sólido

**Fortalezas:** shared kernel pequeño y cohesionado; DTOs derivados de schemas Zod (`z.infer` — imposible divergencia tipo/schema); códigos de error 1:1 con el flujo CU2; subpath exports sin build step; `strict` + `noUncheckedIndexedAccess` + `verbatimModuleSyntax`.

**Debilidades:** sin tests propios de schemas/regex; sin campo `version`; README mínimo sin ejemplos de uso.

### 2.3 `apps/frontend-landing` — 🔧 Parcial

**Fortalezas:** migración a Astro 7 + React 19 + Tailwind v4 + daisyUI **real** (islas React, no SPA disfrazada); i18n type-safe en/es; accesibilidad bien encaminada (`role="alert"`, aria-labels, `disableForReducedMotion`); **38 tests verdes** con MSW (verifican `turnstileToken` en body, clipboard real, anti-doble-submit); UX de éxito pulida (confetti, copy con feedback); `useTurnstile` con cleanup en unmount.

**Debilidades:**

- **No existe `/password-protected`** → el flujo de contraseña del redirector termina en enlace roto (gap crítico de CU2).
- No consume `@min-url/contracts`: duplica interfaces e ignora campos que el backend sí devuelve.
- Errores genéricos ("Something went wrong") que no mapean `API_ERROR_CODES`; validación de URL del cliente más permisiva que el schema del backend (acepta URLs sin protocolo que el backend rechaza con 400).
- `.env.production` local con variables legacy `VITE_*` (incl. site key de reCAPTCHA ya en desuso) y **sin** las `PUBLIC_*` que Astro necesita → build de producción quedaría con `backendUrl = ''`.
- SEO incompleto: sin Open Graph/canonical/hreflang; sitemap con 1 URL y lastmod de enero 2025.

### 2.4 `apps/backend-redirector` — 🔧 Parcial

**Fortalezas:** migración Remix→Fastify 5 **ejecutada** (handler de 78 líneas, `fastify-type-provider-zod`); `strict: true` con `tsc --noEmit` limpio; **11/11 tests verdes** que cubren redirect público, password, 404, 500, error de red, slugs inválidos (verificando que `fetch` NO se invoca) y env vars faltantes; validación Zod de la respuesta interna antes de redirigir; `encodeURIComponent` al propagar slug.

**Debilidades (paso 4 del plan al ~60%):**

- **No maneja el 410 semántico:** backend-services sí emite `SLUG_IS_EXPIRED`/`SLUG_IS_DELETED`, pero el redirector los trata como error genérico → incumple el flujo CU2 del plan.
- Declara `@min-url/contracts` en dependencias pero **jamás lo importa**; duplica `slugDataSchema` localmente (drift garantizado).
- No existe el `RedirectionService`: la lógica vive inline en el handler.
- `envSchema.safeParse(process.env)` **por cada request** (deuda ya listada en el plan, paso 43); `getEnv()` definido pero nunca usado.
- `fetch` global sin keep-alive ni timeout (paso 45); 5 clases de error en `errors.ts` nunca lanzadas (código muerto).

### 2.5 `apps/frontend-dashboard` — 🚧 Legacy

**Fortalezas:** arquitectura modular por features clara; UI sorprendentemente completa (4 KPIs, gráfico 7 días, distribución geográfica/dispositivos, CRUD con dialogs y manejo 409/429 en check-slug); i18n propio; typecheck en verde.

**Debilidades:**

- **Stack divergente del plan:** usa Zustand + axios manual con `useEffect` en vez del TanStack Query definido en la biblia (sin caché, retry ni invalidación).
- `baseURL` **hardcodeada** a `http://localhost:3000` ignorando las envs que el propio proyecto define.
- `authStore` mantiene `accessToken` en el modelo de cliente (invita a robo vía XSS futuro).
- **Cero tests** (`"test": "echo 'No tests configured yet!'"`).
- Toda la UI cuelga de la API legacy que la Parte 1B rehará → deuda pura respecto al plan.

### 2.6 `apps/backend-users` — 🚧 Legacy (mock)

**Fortalezas:** patrón de sesión correcto sobre el papel (cookies `httpOnly` + `sameSite: 'strict'` + `secure` en prod); secreto de refresh distinto al de access; `ThrottlerModule` global (10 req/60s) con override a 30/min en check-slug; endpoints de negocio tras `AuthGuard('jwt')`; `.env` nunca commiteado.

**Debilidades (es funcionalmente un mock):**

- **Crítico:** fallback `process.env.REFRESH_TOKEN_SECRET || 'secret'` (ver SEC-C1).
- **Crítico:** CORS `origin: true` + `credentials: true` (ver SEC-A2).
- **Alto:** `validateUser` retorna `idUsers: 1` **hardcodeado para cualquier cuenta de Google** → cuando `ProtectedService` deje de ser stub, habrá IDOR total por diseño.
- `ProtectedService` 100% stubs; **sin base de datos** (ningún driver en dependencias; los "models" son interfaces TS muertas).
- `HttpExceptionFilter` registrado como provider en vez de `APP_FILTER` → **código muerto** (nunca se ejecuta).
- `tsconfig` sin `strict`; cero tests; refresh tokens sin persistencia/rotación/revocación; logout por GET; access token de 24h pese a comentarios que dicen "30 minutos"; `axios` declarado sin uso.

### 2.7 Testing & QA (global) — 🔧 Parcial

- **~138 tests reales en total** (89 services + 38 landing + 11 redirector), todos verdes localmente. Unitarios con adapters in-memory; integración con DB real.
- **E2E Playwright:** 1 solo spec (`anonymous-shorten.spec.ts`) pero bien hecho: mock de Turnstile vía `addInitScript`, flujo completo shorten → extracción de shortUrl → **navegación real verificando el 302**. El paso 9 del plan está más avanzado localmente de lo que indica.
- **Roto en CI:** `playwright.yml` ejecuta `psql -f backend-services/db/init.sql` — **ruta inexistente** tras el restructure (además no hay `init.sql`; solo la migración Drizzle). Envs desalineadas (`DB_NAME` vs `DATABASE_URL`).
- **Cero tests** en backend-users y frontend-dashboard (pasos 24-25 pendientes).
- Solo chromium (firefox/webkit comentados); no cubre auth ni pantallas 404/410/password.

### 2.8 Infra & CI/CD — 🔧 Parcial

- **Bien:** `turbo.json` coherente 1:1 con scripts; `ci.yml` con postgres:16 + redis y healthchecks, caché de `.turbo`, envs de test completas; hooks husky completos (lint-staged con biome+prettier, commitlint conventional, pre-push con tests); `biome.json` maduro con overrides quirúrgicos por paquete; commits recientes en conventional commits y flujo por PRs.
- **Mal:** `playwright.yml` roto (ver 2.7); **cero Dockerfiles** en todo el repo (paso 13 pendiente); `docker-compose.yml` raíz solo define postgres + redis (el paso 14 ✅ promete "3 servicios + PostgreSQL"), sin healthchecks ni restart policies; CI sin matrix ni CD; un solo paso agregado en CI (fallos poco granulares).

### 2.9 Documentación (global) — 🔧 Parcial

- **ADRs:** lo más consistente del repo — alternativas evaluadas con pros/contras, dictámenes, y secciones de honestidad poco común ("Lo que no sabía al empezar", "Lección aprendida: el Dominio Anémico", "la coexistencia de frameworks es un trade-off real").
- **plan_refactor.md:** biblia sólida pero con drift respecto al código (ver sección 5; sincronizado en esta iteración).
- **README.md:** describía un proyecto que ya no existe (Remix SSR, Sequelize, Redis Pub/Sub, QR codes, Cloudinary). Reescrito en esta iteración.
- **Docs auxiliares:** `arquitectura_del_sistema.md` y `analisis_tecnico.md` describían el sistema pre-refactor (Express 4, Remix, Sequelize); `casos_de_uso_mvp.md` mencionaba MongoDB y Pub/Sub. Eliminadas o reescritas en esta iteración.
- **Doc de observabilidad (pre-ADR-006):** estaba fuera de `docs/adr/` y desactualizado (redirector en Go, Redis Pub/Sub). Reemplazado por el nuevo **ADR-006** (analítica síncrona en el core de backend-services).

### 2.10 Seguridad (global) — 🔧 Parcial

El código **nuevo** tiene controles correctos (scrypt + timingSafeEqual en passwords, Turnstile con timeout y fail-closed, Drizzle 100% parametrizado, cero `dangerouslySetInnerHTML` en frontends, cookies httpOnly/strict, slugs impredecibles, secrets jamás commiteados — verificado en todo el historial git). Pero `backend-users` legacy concentra los 2 hallazgos críticos del repo, y falta el rate limiting que el propio ADR-003 declara no negociable. Detalle completo en la sección 3.

---

## 3. Hallazgos de Seguridad

### 🔴 CRÍTICOS

| ID     | Hallazgo                                                                                                                                                                                                                  | Ubicación                                        | Impacto                                                                                                       | Fix                                                                                                                                                         |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEC-C1 | **Fallback de secreto JWT:** `process.env.REFRESH_TOKEN_SECRET \|\| 'secret'`. Si la env falta, los refresh tokens se verifican con el literal `'secret'` → falsificación trivial de sesiones (falla abierta, silenciosa) | `apps/backend-users/src/auth/auth.service.ts:55` | Bypass total de autenticación en cualquier despliegue sin esa env                                             | Eliminar el fallback; validar todas las envs al bootstrap con Zod (patrón ya usado en `backend-redirector/src/schemas/env.schemas.ts`) y fallar al arranque |
| SEC-C2 | **Credenciales por defecto y puertos expuestos:** Postgres `admin/admin` bindeado a todas las interfaces; Redis sin autenticación                                                                                         | `docker-compose.yml:6-17`                        | Si este compose llega al VPS (Cap 4): lectura/borrado total de la DB; Redis expuesto es vector clásico de RCE | Credenciales vía `.env` (gitignored), bind `127.0.0.1:`, `requirepass` en Redis, y `docker-compose.prod.yml` separado                                       |

### 🟠 ALTOS

| ID     | Hallazgo                                                                                                                                                                                                                                                          | Ubicación                                           | Impacto                                                                                                                                             | Fix                                                                                                                                               |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEC-A1 | **Rate limiting inexistente en backend-services.** `express-rate-limit` ni siquiera está instalado; `LIMITS_VALUES` (`config/constants.ts:10`) definido y muerto. El ADR-003 declara el rate limiting en `verify-password` "requisito de seguridad no negociable" | `apps/backend-services/src/app.ts`                  | Abuso masivo del acortador (rellenado de DB, presión sobre espacio de slugs); fuerza bruta ilimitada de contraseñas cuando exista `verify-password` | Instalar y montar rate limit global + uno estricto (p. ej. 5 req/min/IP) reservado a `verify-password` **antes** de implementarlo; store en Redis |
| SEC-A2 | **CORS reflexivo con credenciales:** `origin: true, credentials: true` refleja cualquier origen aceptando cookies                                                                                                                                                 | `apps/backend-users/src/main.ts:8-11`               | Equivale a CORS `*` con credenciales; hoy solo mitiga `sameSite: 'strict'`                                                                          | Whitelist explícita desde env (`DASHBOARD_URL`)                                                                                                   |
| SEC-A3 | **Identidad hardcodeada:** `validateUser` retorna `idUsers: 1` para cualquier cuenta de Google; todo endpoint protegido opera con `userId = 1`                                                                                                                    | `apps/backend-users/src/auth/auth.service.ts:28-32` | IDOR total por diseño cuando `ProtectedService` toque datos reales; confusión de cuentas                                                            | Implementar lookup/creación por `googleId` (Parte 1B); mientras tanto, considerar deshabilitar endpoints mutadores de `/protected/*`              |

### 🟡 MEDIOS

| ID     | Hallazgo                                                                                                                                                                                                                                                                                                             | Ubicación                                                                                                                                   | Impacto                                                                                                                                        | Fix                                                                                                                                                                                   |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEC-M1 | **Sin bloqueo de IPs privadas/loopback/metadata en URLs acortadas.** Verificado empíricamente: se aceptan `http://169.254.169.254/...`, `http://127.0.0.1`, `http://192.168.1.1`. Matiz: no hay SSRF directo (el backend nunca fetchea el target), pero el servicio queda como **open-redirect hacia infra interna** | `apps/backend-services/src/core/domain/value-objects/target-url/url.schema.ts:17-24`                                                        | Phishing creíble con dominio propio; SSRF indirecto si un consumidor (unfurlers de Slack/Discord) resuelve el redirect desde dentro de una VPC | Rechazar hosts que sean IP literal privada (loopback, RFC1918, link-local 169.254.0.0/16, CGNAT, `::1`, `fc00::/7`) y dominios `localhost`/`.internal`/`.local` en `TargetUrl.create` |
| SEC-M2 | **`z.url()` de Zod 4 acepta `javascript:`/`data:`/`file:`** (verificado ejecutándolo). Hoy la escritura está protegida por el VO `TargetUrl` (exige http/https), pero el **contrato compartido no**: el redirector confía ciegamente en el upstream (`reply.redirect(data.originalUrl)`)                             | `packages/contracts/src/schemas.ts:16`; `apps/backend-redirector/src/schemas/routes.schemas.ts:25`; `apps/backend-redirector/src/app.ts:73` | Si alguna vía de escritura futura valida solo con el contrato → 302 a `javascript:` (XSS en contexto del redirector)                           | Crear `httpUrlSchema` en contracts (refine de protocolo http/https) y usarlo en `shortenAnonymousRequestSchema`, `slugDataSchema` y `slugDataResponseSchema`                          |
| SEC-M3 | **Token interno sin timing-safe ni validación de esquema:** `token !== secret` (timing attack) y `.split(' ')[1]` acepta cualquier esquema                                                                                                                                                                           | `apps/backend-services/src/adapters/primary/http/middlewares/verifyInternalToken.middleware.ts:14`                                          | Timing oracle para recuperar `INTERNAL_SECRET` si el endpoint se expone                                                                        | `crypto.timingSafeEqual` con buffers de igual longitud + exigir esquema `Bearer` explícito                                                                                            |
| SEC-M4 | **Spoofing de IP del cliente:** `trust proxy: true` sin whitelist + `x-forwarded-for` crudo + `req.body.ip` con prioridad                                                                                                                                                                                            | `apps/backend-services/src/app.ts:21`; `apps/backend-services/src/adapters/primary/http/controllers/url.controller.ts:32-36`                | Corrupción de analítica/geolocalización; elusión total del futuro rate limiting por IP                                                         | `app.set('trust proxy', 1)`; eliminar `req.body.ip`; usar `req.ip` normalizado                                                                                                        |
| SEC-M5 | **Google OAuth sin parámetro `state`** (login CSRF) y `callbackURL` relativa (se construye desde header `Host`)                                                                                                                                                                                                      | `apps/backend-users/src/auth/strategies/google.strategy.ts:18-23`                                                                           | Login CSRF: un atacante puede hacer que la víctima complete login en la cuenta del atacante                                                    | `state: true` con store de sesión; `callbackURL` absoluta desde env                                                                                                                   |
| SEC-M6 | **Refresh tokens sin rotación ni revocación; access token de 24h** (comentarios mienten "30 minutos"). Logout solo limpia cookies — el token robado sigue válido 7 días                                                                                                                                              | `apps/backend-users/src/auth/auth.service.ts:38-45,60-72`; `auth.controller.ts:54,96-108`                                                   | Ventana de robo de 7 días sin forma de invalidar                                                                                               | Persistir refresh hasheados, rotar en cada `/auth/refresh`, revocar en logout, bajar access a 15-30 min                                                                               |

### 🟢 BAJOS

| ID      | Hallazgo                                                                                                                                                                                                                  | Ubicación                                                                                  |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| SEC-B1  | `HttpExceptionFilter` nunca registrado (código muerto); si se activa tal cual, filtrará `exception.message` interno al cliente                                                                                            | `apps/backend-users/src/http-exception/http-exception.filter.ts:16-18`; `app.module.ts:27` |
| SEC-B2  | Sin helmet / `@fastify/helmet` en los 3 servicios (Cap 4, aplazado conscientemente)                                                                                                                                       | `app.ts` / `main.ts` de los 3 backends                                                     |
| SEC-B3  | Flujo de contraseñas incompleto de punta a punta: `Password.vo` bien implementado (scrypt+timingSafeEqual) sin uso; contrato sin campo `password`; sin endpoint `verify-password`; redirector apunta a página inexistente | Varios                                                                                     |
| SEC-B4  | JWT strategy sin `algorithms: ['HS256']` explícito                                                                                                                                                                        | `apps/backend-users/src/auth/strategies/jwt.strategy.ts:14-18`                             |
| SEC-B5  | Sin rate limiting en `GET /:slug` → enumeración de slugs (impacto limitado: espacio 62⁶)                                                                                                                                  | `apps/backend-redirector/src/app.ts`                                                       |
| SEC-B6  | Oráculo de estados de slug en endpoint interno (404 vs 410 distinguibles por quien tenga el token)                                                                                                                        | `apps/backend-services/.../errorHandler.middleware.ts:29-35`                               |
| SEC-B7  | Logout por GET (cambio de estado vía GET; mitigado por `sameSite: 'strict'`)                                                                                                                                              | `apps/backend-users/src/auth/auth.controller.ts:103-108`                                   |
| SEC-B8  | Tipo `User` del dashboard incluye `accessToken` (invita a meter el token en JS/robo XSS)                                                                                                                                  | `apps/frontend-dashboard/src/stores/authStore.ts:9`                                        |
| SEC-B9  | `express.json()` sin límite explícito (default 100kb; payloads reales son pequeños)                                                                                                                                       | `apps/backend-services/src/app.ts:16`                                                      |
| SEC-B10 | Claves de Turnstile de TEST (`1x000...AA` = "always passes") en `.env` local: correctas en dev/CI, pero nada impide que lleguen a producción                                                                              | `apps/backend-services/.env:9`                                                             |
| SEC-B11 | `.env.production` local del landing con variables legacy `VITE_*` + site key reCAPTCHA en desuso; faltan las `PUBLIC_*` que Astro necesita (no commiteado; site keys son públicas por diseño)                             | `apps/frontend-landing/.env.production`                                                    |
| SEC-B12 | Coexistencia de Zod 3.23.8 (transitivo) con Zod 4.4.3 en el árbol de dependencias                                                                                                                                         | `node_modules/.bun`                                                                        |

### ✅ Verificado como CORRECTO (para constancia)

1. **Secretos en git:** ningún `.env*` está trackeado y el historial **nunca** los contuvo (verificado con `git ls-files`, `git log -S` y `git check-ignore`). `personal_notes/` tampoco fue commiteado jamás.
2. **`INTERNAL_SECRET`:** 64 hex aleatorios, viaja por `Authorization: Bearer` correctamente (assertado en tests).
3. **Hashing de passwords de URL:** scrypt + salt aleatorio 16B + `timingSafeEqual`. Sin plaintext ni SHA simple.
4. **SQL injection:** imposible por diseño — todo Drizzle parametrizado; el test del VO `Slug` incluye el payload `' OR 1=1 --` y se rechaza.
5. **Validación en bordes:** Zod en body (Express), params (Fastify) y env (redirector).
6. **Error handlers:** 500 genérico sin stack en Express; Fastify redirige a `/error` sin filtrar detalles.
7. **Cookies:** `httpOnly` + `sameSite: 'strict'` + `secure` en prod; tokens nunca en body JSON.
8. **XSS frontends:** cero `dangerouslySetInnerHTML`/`innerHTML`; `localStorage` solo guarda tema/idioma.
9. **Dependencias:** versiones actuales sin CVEs evidentes (Express 5.2.1, NestJS 11, Fastify 5.10, axios 1.18.1, zod 4.4.3, pg 8.22).
10. **Slugs:** impredecibles (`sha256(url + randomUUID())`), IDs con `uuidv7`; sin secuencias enumerables.
11. **Turnstile:** verificación server-side con timeout 5s y fail-closed ante token vacío.

---

## 4. Evaluación Arquitectónica

### Lo que está bien

1. **Hexagonal genuino** en backend-services — no es teatro arquitectónico: verificado a nivel de imports, con dirección de dependencias estrictamente hacia adentro y DI manual consciente en `bootstrap.ts`.
2. **Narrativa experimental con método científico** (plan_refactor): tracking síncrono deliberado (ADR-006) → medir bajo carga → optimizar guiado por métricas → ADR por iteración.
3. **Strangler Fig bien ejecutado:** legacy eliminado del core (paso 10 real), contracts como shared kernel, coexistencia controlada durante la migración.
4. **ADR-004 (separación híbrida faseada)** muestra criterio contra la sobre-ingeniería prematura: medir primero, separar después.
5. **Monorepo bien gobernado:** Turborepo coherente, biome con overrides por paquete, husky completo, conventional commits, PRs con template.

### Los baches

1. **Drift documental vs código** (ver sección 5): la biblia divergía del código en varios puntos (sincronizado en esta iteración).
2. **Inconsistencia arquitectónica entre servicios:** backend-services es hexagonal estricto mientras el redirector tiene lógica inline (sin `RedirectionService`) y backend-users es scaffold sin arquitectura.
3. **Contratos declarados pero no consumidos** en 2 de 3 consumidores (redirector y landing duplican schemas → el drift que contracts debía prevenir ya está ocurriendo).
4. **Flujo de password roto de punta a punta:** VO implementado sin uso → contrato sin campo → sin endpoint → redirector apunta a página inexistente.
5. **Deuda de runtime conocida:** dotenv-order bug, env parse por request, fetch sin keep-alive/timeout, sin graceful shutdown ni healthchecks — listada en el propio plan (#43, #45).

---

## 5. Inconsistencias Documentación vs Código

| #   | Documento                             | Dice                                                      | Realidad                                                                                                             |
| --- | ------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| D1  | plan_refactor.md (decisiones + stack) | Zod 3.23.x unificado                                      | **Zod 4.4.3** en todo el repo (plan desactualizado, no bug) — sincronizado 2026-07-25                                |
| D2  | plan_refactor.md paso 4               | Refactor redirector pendiente                             | Fastify migrado ~60%: falta 410 semántico, consumo de contracts y `RedirectionService` — estado corregido en el plan |
| D3  | plan_refactor.md paso 9               | E2E pendiente                                             | Spec E2E CU1+CU2 existe y pasa local; **roto en CI** (ruta `init.sql` inexistente)                                   |
| D4  | plan_refactor.md (estructura)         | Puertos planos, VOs planos                                | Puertos `inbound/outbound/`, VOs en subcarpetas con schema separado — sincronizado en el plan                        |
| D5  | ADR-004                               | `short_urls.user_id`; migraciones antiguas a `db/legacy/` | Sin `user_id` (CU5 pendiente); `db/legacy/` no existe                                                                |
| D6  | ADR-003 v1.2.0                        | "Se implementó como se planeó"                            | Cierto en Fastify y delegación de password; **falso** en contracts y manejo 410                                      |
| D7  | plan_refactor.md paso 14              | docker-compose "3 servicios + PostgreSQL"                 | Solo postgres + redis — estado corregido en el plan                                                                  |
| D8  | plan_refactor.md (stack)              | Dashboard con TanStack Query                              | Dashboard usa Zustand + axios manual                                                                                 |
| D9  | README.md                             | Remix SSR, Sequelize, Redis Pub/Sub, QR codes, Cloudinary | Obsoleto — README reescrito 2026-07-25                                                                               |
| D10 | casos_de_uso_mvp.md                   | Redirector Remix, analytics en MongoDB, Pub/Sub           | Obsoleto — reescrito 2026-07-25 (Fastify, PG síncrono)                                                               |
| D11 | Doc pre-ADR-006                       | Redirector en **Go**, Redis Pub/Sub                       | Eliminado; reemplazado por ADR-006 (analítica síncrona en el core)                                                   |

---

## 6. Plan de Remediación Priorizado

Vinculado a los pasos del `plan_refactor.md`. Detalle de ejecución en el tracker (sección 8).

### Fase 0 — Higiene inmediata

1. **Seguridad:** SEC-C1 (env validation al bootstrap en los 3 servicios), SEC-A2 (CORS whitelist), SEC-M3 (timing-safe + Bearer), SEC-M2 (`httpUrlSchema` en contracts), SEC-M4 (trust proxy 1 + eliminar `req.body.ip`), SEC-B4, SEC-B7.
2. **CI:** arreglar `playwright.yml` (migración Drizzle en vez de `init.sql`; alinear envs).
3. **Env hygiene:** `.env.example` por app; limpiar `.env.production` del landing; validación anti-test-keys de Turnstile cuando `NODE_ENV=production`.

### Fase 1 — Cerrar Capítulo 1

4. Completar paso 4: manejo 410 + pantallas, consumo real de contracts, extraer `RedirectionService`.
5. Paso 5: página `/password-protected` + contracts en landing + endpoint `verify-password` **con SEC-A1 (rate limiting) implementado primero**.
6. Paso 13: Dockerfiles multi-stage de los 3 servicios + compose completo (cierra SEC-C2).
7. Parte 1B: better-auth + DB propia en backend-users (mata SEC-A3 y SEC-M6), CU5, CU6, tests reales (pasos 24-25), dashboard reconectado (cierra SEC-B8).

### Fase 2 — Observabilidad y carga

8. Pasos 27-40: Pino, Prometheus, `/metrics` + `/health`, docker-compose.loadtest, escenarios K6 con constraints (1 core/500MB), baseline, experimento de tracking (ver ADR-006), dashboards Grafana, ADR de resultados.

### Fase 3 — Producción

9. Cap 4 esencial: VPS + compose prod + Nginx + SSL + dominio propio + Grafana Cloud + backups. (SEC-M1, SEC-B2, SEC-B5 cierran aquí si no antes.)

### Anti-alcance explícito

No hacer: gRPC benchmark, shootout Express-vs-Fastify, Mongo políglota, OpenTelemetry completo, K8s real, QR codes, Cloudinary.

---

## 7. Reseña Global

El monorepo tiene un núcleo de ingeniería sólido: `backend-services` aplica arquitectura hexagonal de forma verificable (no declarativa), el dominio tiene invariantes reales, los tests son de verdad (~138 en 3 paquetes), y las decisiones están documentadas con alternativas en ADRs consistentes. Las debilidades se concentran en tres frentes: (1) **coherencia de superficie** — documentación y CI que habían quedado detrás del código (corregido en esta iteración, salvo `playwright.yml`); (2) **paquetes legacy** — `backend-users` (mock con 2 críticos de seguridad) y `frontend-dashboard` (stack divergente, sin tests), cuya reconstrucción ya está planificada como Parte 1B; (3) **deuda de seguridad puntual** — rate limiting ausente y hardening de bordes, con fixes ya especificados en la Fase 0.

### Criterios objetivos de cierre por fase

| Fase   | Criterio de "completa" (verificable)                                                                                                |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Fase 0 | CI verde incluyendo E2E · cero hallazgos críticos/altos abiertos en el tracker · envs validadas al bootstrap en los 3 servicios     |
| Cap 1  | Flujo password funcional de punta a punta (endpoint + página + rate limit) · 3 Dockerfiles + compose completo · auth real con tests |
| Cap 2  | `/metrics` + `/health` en servicios · dashboards operativos · experimento de tracking documentado con ADR de resultados             |
| Cap 4  | Deploy accesible en dominio propio · rate limiting y helmet activos · backups automatizados                                         |

---

## 8. Tracker de Remediación

Estado: ⏳ pendiente · 🔧 en curso · ✅ resuelto · ➖ descartado/wontfix

### Seguridad

| ID         | Hallazgo                                    | Estado | Notas / PR                                                                             |
| ---------- | ------------------------------------------- | ------ | -------------------------------------------------------------------------------------- |
| SEC-C1     | Fallback `\|\| 'secret'` JWT                | ⏳     | Fase 0                                                                                 |
| SEC-C2     | Credenciales/puertos docker-compose         | ⏳     | Fase 0 (compose dev) + paso 54 (prod)                                                  |
| SEC-A1     | Rate limiting ausente (backend-services)    | ⏳     | **Antes de `verify-password`** (ADR-003)                                               |
| SEC-A2     | CORS reflexivo con credenciales             | ⏳     | Fase 0 / paso 20 del plan                                                              |
| SEC-A3     | Identidad `idUsers: 1` hardcodeada          | ⏳     | Parte 1B (better-auth + DB)                                                            |
| SEC-M1     | Sin bloqueo IPs privadas en TargetUrl       | ⏳     | Fase 1 o Cap 4                                                                         |
| SEC-M2     | `z.url()` acepta `javascript:` en contracts | ⏳     | Fase 0 (`httpUrlSchema`)                                                               |
| SEC-M3     | Token interno no timing-safe                | ⏳     | Fase 0                                                                                 |
| SEC-M4     | Spoofing de IP (trust proxy / body.ip)      | ⏳     | Fase 0                                                                                 |
| SEC-M5     | OAuth sin `state`, callback relativa        | ⏳     | Parte 1B                                                                               |
| SEC-M6     | Refresh sin rotación; access 24h            | ⏳     | Parte 1B (better-auth lo resuelve)                                                     |
| SEC-B1-B12 | Bajos (ver tabla)                           | 🔧     | SEC-B9 (payload limit 5KB) y SEC-B2 (helmet) resueltos en backend-services (Issue #37) |

### Arquitectura / Código

| ID     | Hallazgo                                                                     | Estado             | Notas / PR                                                                          |
| ------ | ---------------------------------------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------- |
| ARC-1  | Bug orden dotenv (`app.ts:25`)                                               | ✅                 | Resuelto: `loadEnv()` explícito como primer paso del bootstrap (Issue #41 / PR #66) |
| ARC-2  | 410 semántico no manejado en redirector                                      | ⏳                 | Paso 4                                                                              |
| ARC-3  | Contracts declarados pero no consumidos (redirector + landing)               | ⏳                 | Pasos 4 y 5                                                                         |
| ARC-4  | `/password-protected` en landing                                             | 🚫 **DESESTIMADO** | Retirado del alcance MVP por YAGNI (PR #62 y PR #63 - Issues #60 y #61)             |
| ARC-5  | `expirationDate` zombie en `isExpired()`                                     | ⏳                 | Paso 3 (CU2 tracking)                                                               |
| ARC-6  | `RedirectionService` ausente (lógica inline)                                 | ⏳                 | Paso 4                                                                              |
| ARC-7  | `envSchema.safeParse` por request (redirector)                               | ⏳                 | Paso 43                                                                             |
| ARC-8  | `fetch` sin keep-alive/timeout (redirector)                                  | ⏳                 | Paso 45                                                                             |
| ARC-9  | Dashboard: stack divergente (Zustand vs TanStack Query), baseURL hardcodeada | ⏳                 | Parte 1B                                                                            |
| ARC-10 | backend-users: scaffold mock (stubs, sin DB, sin strict, filter muerto)      | ⏳                 | Parte 1B                                                                            |

### Infra / Docs

| ID    | Hallazgo                                                                    | Estado | Notas / PR                                                     |
| ----- | --------------------------------------------------------------------------- | ------ | -------------------------------------------------------------- |
| INF-1 | `playwright.yml` roto (ruta `init.sql`, envs)                               | ⏳     | Fase 0                                                         |
| INF-2 | Sin Dockerfiles (paso 13)                                                   | ⏳     | Fase 1                                                         |
| INF-3 | docker-compose sin healthchecks ni backends (paso 14)                       | ⏳     | Fase 1                                                         |
| DOC-1 | README obsoleto (D9)                                                        | ✅     | Reescrito (EN + resumen ES)                                    |
| DOC-2 | Drift plan_refactor (D1-D4, D7, D8)                                         | ✅     | Sincronizado 2026-07-25                                        |
| DOC-3 | Docs auxiliares obsoletas (D10, analisis_tecnico, arquitectura_del_sistema) | ✅     | `casos_de_uso_mvp.md` reescrito; las otras dos eliminadas      |
| DOC-4 | Doc observabilidad legacy fuera de `docs/adr/` y desactualizado (D11)       | ✅     | Eliminado; reemplazado por ADR-006 (analítica sync en el core) |
| DOC-5 | Sin `.env.example` en las apps                                              | ⏳     | Fase 0                                                         |

---

> **Nota de transparencia:** esta auditoría fue realizada con asistencia de IA (análisis estático, verificación empírica y auditoría de seguridad automatizada) bajo dirección y revisión humana completa. Cada hallazgo fue verificado contra el código y, donde fue posible, contra el comportamiento en ejecución (tests, typecheck, evaluación de schemas Zod).

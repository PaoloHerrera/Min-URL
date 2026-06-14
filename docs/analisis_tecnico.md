# 🔬 Análisis Técnico Profundo — Min-URL

## Descripción General

**Min-URL** es una plataforma de acortado de URLs y generación de códigos QR, con dashboard analítico en tiempo real. Está estructurada como un **monorepo de microservicios** gestionado con **Turborepo + Bun** y contiene cinco paquetes independientes.

---

## Stack Tecnológico

### Monorepo & Tooling

| Herramienta | Versión | Rol |
|---|---|---|
| **Turborepo** | 2.4.4 | Orquestación del monorepo (builds, dev en paralelo) |
| **Bun** | 1.2.9 | Package manager principal |
| **Biome** | 1.9.4 | Linter + formatter unificado (reemplaza ESLint + Prettier) |

### Base de Datos e Infraestructura

| Tecnología | Versión | Rol |
|---|---|---|
| **PostgreSQL** | 16.0 | Base de datos relacional principal |
| **Redis** | latest | Pub/Sub para procesamiento asíncrono de clics |
| **Docker Compose** | — | Provisión local de Postgres + Redis |
| **Sequelize** | 6.37.3 | ORM (compartido entre `backend-services` y `backend-users`) |

### Backend — `backend-services` (Express.js)

| Tecnología | Rol |
|---|---|
| **Node.js + Express 4** | API REST de servicios: acortado, QR, redirección |
| **Sequelize** | ORM para modelos de URLs, clics, geolocalizaciones |
| **ioredis** | Publicador de eventos de clic a Redis |
| **Passport.js** | (importado como dependencia pero no activamente usado aquí) |
| **express-rate-limit** | Rate limiting por IP |
| **geoip-lite / geoip-country** | Geolocalización offline por IP |
| **qrcode** | Generación de QR Codes server-side |
| **zod** | Validación de schemas |
| **validator** | Validación de URLs |
| **Cloudinary** | Almacenamiento de imágenes (configurado, no visible en rutas actuales) |
| **axios** | Comunicación inter-servicios (no usado en este servicio directamente) |

### Backend — `backend-users` (NestJS)

| Tecnología | Rol |
|---|---|
| **NestJS 11** | Framework de autenticación y gestión de usuarios |
| **@nestjs/passport + passport-google-oauth20** | OAuth2 con Google |
| **@nestjs/jwt + passport-jwt** | Autenticación JWT con access/refresh tokens |
| **@nestjs/sequelize** | ORM del módulo de usuarios |
| **@nestjs/throttler** | Rate limiting (10 req/min por IP) |
| **cookie-parser** | Manejo de cookies httpOnly para tokens |
| **axios** | Proxy de requests hacia `backend-services` |
| **@nestjs/websockets** | WebSockets (referenciado, aún no implementado del todo) |

### Backend — `backend-redirector` (Remix)

| Tecnología | Rol |
|---|---|
| **Remix 2.16** | SSR framework para la redirección de URLs |
| **ioredis** | Publicación de eventos de clic a Redis |
| **ua-parser-js** | Detección de tipo de dispositivo desde User-Agent |
| **remix-utils** | Extracción de IP real del cliente |
| **is-ip** | Validación de direcciones IP |
| **isbot** | Detección de bots (para filtrar clics no reales) |

### Frontend — `frontend-dashboard` (React + Vite)

| Tecnología | Rol |
|---|---|
| **React 19 + Vite 6** | SPA del dashboard administrativo |
| **TailwindCSS v4** | Estilos utility-first |
| **Radix UI** | Componentes accesibles sin estilos (Dialog, Dropdown, Select…) |
| **TanStack Query v5** | Fetching y caching de datos del dashboard |
| **Zustand 5** | Estado global (usuario, estadísticas) |
| **react-hook-form** | Manejo de formularios |
| **recharts** | Gráficos de estadísticas (líneas, pie) |
| **react-qr-code** | Preview de QR en frontend |
| **socket.io-client** | Conexión WebSocket con `backend-users` |
| **motion (Framer Motion)** | Animaciones |
| **sonner** | Notificaciones toast |
| **lucide-react** | Iconos |
| **next-themes** | Modo oscuro/claro |
| **i18n custom** | Traducción en/es implementada manualmente |

### Frontend — `frontend-landing` (React + Vite)

| Tecnología | Rol |
|---|---|
| **React 19 + Vite 6** | Landing page pública |
| **TailwindCSS v4** | Estilos |
| **Shadcn/UI** | Componentes (`components.json` presente) |

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUARIO FINAL                           │
└───────────┬─────────────────────────┬───────────────────────────┘
            │                         │
            ▼                         ▼
   ┌─────────────────┐     ┌────────────────────┐
   │ frontend-landing│     │ frontend-dashboard  │
   │  (React+Vite)   │     │  (React+Vite+Query) │
   │  Página pública │     │  Panel de gestión   │
   └────────┬────────┘     └──────────┬──────────┘
            │                         │ JWT (httpOnly Cookie)
            │                         ▼
            │              ┌────────────────────┐
            │              │   backend-users     │
            │              │   (NestJS 11)       │
            │              │   - Auth Google     │
            │              │   - JWT tokens      │
            │              │   - Dashboard data  │
            │              │   - Proxy → svc     │
            │              └──────────┬──────────┘
            │                         │ X-API-Key
            │                         ▼
            │              ┌────────────────────┐
            ▼              │  backend-services   │◄──── Redis Sub
   ┌─────────────────┐     │  (Express.js)       │
   │backend-redirector│    │  - Short URL CRUD   │
   │  (Remix SSR)    │     │  - QR Code CRUD     │
   │  - Redirección  │     │  - Geo middleware    │
   │  - Tracking     │     │  - Slug generator   │
   └────────┬────────┘     └──────────┬──────────┘
            │                         │
            │ Redis Pub               ▼
            └────────────► ┌────────────────────┐
                           │     Redis          │
                           │  (Pub/Sub clicks)  │
                           └────────────────────┘
                                      │
                           ┌──────────▼──────────┐
                           │     PostgreSQL       │
                           │  - users            │
                           │  - urls             │
                           │  - short_urls       │
                           │  - qr_codes         │
                           │  - clicks           │
                           │  - clicks_details   │
                           │  - geolocations     │
                           └─────────────────────┘
```

### Flujo de Redirección con Tracking Asíncrono

1. Usuario accede a `min-url.com/SLUG` → **backend-redirector**
2. Remix loader consulta `backend-services` vía API Key para obtener datos del slug
3. Si la URL no tiene password: **publica evento en Redis** y hace redirect HTTP 302
4. `backend-services` escucha Redis (pSubscribe) → guarda Click + ClickDetail + Geolocation en Postgres
5. Todo el tracking es **completamente asíncrono**, la redirección no bloquea

---

## Modelo de Base de Datos

El esquema es sólido y bien pensado:

- `users` → `refresh_tokens` (cascade)
- `users` → `urls` → `short_urls`, `qr_codes`, `clicks` (cascade)
- `clicks` → `clicks_details` → `geolocations`
- **6 SQL Views** para el dashboard (KPIs, últimos 7 días, países, dispositivos, top links, top QR codes)
- **9 índices** estratégicamente colocados en columnas clave
- Soft-delete implementado (`deleted`, `deleted_at`)
- Expiración de URLs (`expiration`, `expired`, `expired_at`)
- URLs protegidas por contraseña (`password`, `password_hash`)

---

## Estado Funcional — ¿Qué está implementado?

### ✅ Completamente funcional

- Sistema de autenticación OAuth2 Google (NestJS + Passport)
- JWT con access token (24h) + refresh token (7 días) via httpOnly cookies
- Creación de Short URLs (con slug aleatorio o personalizado)
- Generación de QR Codes con colores personalizables
- Eliminación y actualización de URLs
- Dashboard con KPIs (total clicks, hoy, variación, links activos, % únicos)
- Dashboard con gráfico últimos 7 días, países, dispositivos, top links, top QRs
- Geolocalización offline por IP (geoip-lite)
- Tracking asíncrono de clics vía Redis Pub/Sub
- Rate limiting (throttler en NestJS, limitRequests en Express)
- Validación de URLs y slugs
- Detección de extensiones de archivo prohibidas
- Modo oscuro/claro (next-themes)
- Internacionalización EN/ES

### ⚠️ Parcialmente implementado o incompleto

| Feature | Estado |
|---|---|
| **Password de URLs** | Esquema en DB listo, lógica en redirector pendiente (`<div>URL con password: {data.long_url}</div>`) |
| **WebSockets (socket.io)** | Dependencia instalada (`socket.io-client` + `@nestjs/websockets`), `dashboard.gateway.ts` existe pero tiene solo stub básico |
| **Expiración automática de URLs** | Campos en DB presentes, ningún job/cron encontrado para marcarlas como expiradas |
| **GitHub OAuth** | Columna `github_id` en DB, sin implementación en el código |
| **API pública (purpose='api')** | Enum creado en DB, sin rutas ni lógica |
| **Cloudinary** | Configurado en constants, no hay rutas de upload visibles |
| **frontend-landing** | Módulos `home` y `core` con estructura mínima |
| **Notificaciones** | Strings en i18n presentes (`notifications.title`, `empty`, `seeAll`), sin implementación UI |

### ❌ Problemas y riesgos identificados

| Problema | Severidad | Descripción |
|---|---|---|
| **Access token en respuesta de API** | 🔴 Alta | `protected.service.ts` devuelve `accessToken` en el payload de datos del usuario (`userData.accessToken`). Un token JWT nunca debería exponerse así. |
| **Sin tests reales** | 🟡 Media | Los archivos `.spec.ts` de NestJS están en el repositorio pero son stubs vacíos (solo boilerplate de NestJS CLI). `backend-services` no tiene ningún test. |
| **`console.log` en producción** | 🟡 Media | Múltiples `console.log` activos en `auth.controller.ts`, `redis.js`, `$slug.tsx`. Debería usarse un logger estructurado. |
| **Comentario con credencial de DB en docker-compose** | 🟡 Media | `POSTGRES_USER: admin / POSTGRES_PASSWORD: admin` son credenciales hardcoded en docker-compose. No deben usarse en producción. |
| **Sin manejo de error en `refreshToken`** | 🟡 Media | El comentario del código dice "Duración de 30 minutos" pero el cookie es de 24 horas. Inconsistencia de documentación. |
| **`ShorturlServices.js` importado con nombre inconsistente** | 🟠 Baja | `UserController.js` importa desde `'../services/ShorturlServices.js'` (minúscula) pero el archivo se llama `ShortUrlServices.js`. En Windows no falla (case-insensitive) pero fallará en Linux (producción). |
| **Sin `pgdata` volume mapeado** | 🟠 Baja | `docker-compose.yml` declara el volume `pgdata` pero no lo usa (Postgres no persiste data si se borra el container). |
| **`limitRequests.js` no desactivado en middleware** | 🟠 Baja | El middleware existe pero no está montado en ninguna ruta actualmente. |
| **`backend-redirector` nombrado como "backend"** | ℹ️ Info | Es un frontend SSR (Remix), no un backend tradicional. El nombre puede confundir. |

---

## Patrones de Diseño Notables

- **Proxy Pattern**: `backend-users` actúa como proxy autenticado hacia `backend-services`, añadiendo el `X-API-Key` antes de reenviar.
- **Pub/Sub asíncrono**: El tracking de clics no bloquea la redirección — patrón excelente para performance.
- **Middleware chain**: Express usa cadenas de middlewares especializados (validateUrl → checkForbiddenExtension → addGeolocation → controller).
- **SlugGenerator con retry logic**: Implementa backoff con incremento de longitud si hay colisiones.
- **SQL Views para analytics**: Lógica de agregación encapsulada en la base de datos — buena separación de responsabilidades.

---

## Métricas del Proyecto

| Métrica | Valor |
|---|---|
| Paquetes en el monorepo | 5 |
| Tablas en la DB | 7 |
| Vistas SQL | 6 |
| Índices SQL | 9 |
| Rutas de API (backend-services) | ~9 endpoints |
| Rutas de API (backend-users) | ~8 endpoints |
| Módulos frontend (dashboard) | 10 módulos |
| Idiomas soportados | 2 (ES, EN) |

---

## Recomendaciones de Mejora

### Urgentes
1. **Eliminar `accessToken` del payload** de `getData()` en `ProtectedService`. El frontend debe usar el token de la cookie httpOnly, no recibirlo en JSON.
2. **Implementar el flujo de password** en `backend-redirector/$slug.tsx` — actualmente muestra la URL en texto plano.
3. **Arreglar el import case-sensitive** `ShorturlServices.js` → `ShortUrlServices.js` en `UserController.js`.

### Corto Plazo
4. Añadir un **cron job** para expirar URLs automáticamente (sugerido: `@nestjs/schedule`).
5. Reemplazar `console.log` con un logger real (`winston`, `pino`, o el logger de NestJS).
6. Añadir tests unitarios reales en los `.spec.ts` existentes.
7. Configurar el **volume de Postgres** correctamente en docker-compose para que los datos persistan.

### Largo Plazo
8. Implementar **GitHub OAuth** (columna ya existe).
9. Completar el sistema de **notificaciones WebSocket**.
10. Implementar la **API pública** (`purpose='api'` ya existe en el enum de DB).
11. Añadir **CI/CD pipeline** (GitHub Actions) — no existe ningún workflow actualmente.

[![CI/CD for Min-URL](https://github.com/PaoloHerrera/Min-URL/actions/workflows/ci.yml/badge.svg)](https://github.com/PaoloHerrera/Min-URL/actions/workflows/ci.yml)

<div align="center">

# 🔗 Min-URL

**A modern, full-stack URL shortener with real-time analytics**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E=20-green.svg)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.4.4-blueviolet.svg)](https://turbo.build)
[![Bun](https://img.shields.io/badge/Bun-1.2.9-orange.svg)](https://bun.sh)

[Features](#-features) · [Architecture](#-architecture) · [Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure)

</div>

---

## ✨ Features

- 🔗 **URL Shortener** — Generate short links with Base62 cryptographic slugs (6-12 chars)
- 📊 **Analytics Dashboard** — Real-time stats: total clicks, today's activity, geographic distribution, device breakdown
- 🌍 **Geolocation Tracking** — Offline IP-to-location mapping using `geoip-lite`
- ⚡ **Synchronous Click Tracking (MVP)** — Atomic $O(1)$ visit persistence in PostgreSQL (ADR-006)
- 🔐 **Google OAuth 2.0 & JWT** — Authentication with httpOnly cookies (backend-users)
- 🌐 **i18n** — English public interface and Spanish internal docs
- 🌙 **Dark Mode** — Modern UI with dark/light themes
- 🚦 **Rate Limiting & Security** — Cloudflare Turnstile anti-bot verification, strict URL limits (max 2048 chars)
- 🔒 **Password-protected URLs** — Domain-level support for protected links

---

## 🏗 Architecture

Min-URL is a **Turborepo monorepo** composed of applications and shared packages:

```text
┌──────────────────────────────────────────────────────────────────┐
│                         END USER                                 │
└────────────┬───────────────────────────┬─────────────────────────┘
             │                           │
             ▼                           ▼
   ┌──────────────────┐       ┌─────────────────────┐
   │ frontend-landing │       │  frontend-dashboard  │
   │ (Astro 7+React19)│       │  (React 19 + Vite)   │
   │  Public website  │       │  Analytics dashboard │
   └────────┬─────────┘       └──────────┬───────────┘
            │                            │ JWT (httpOnly cookie)
            │                            ▼
            │                 ┌─────────────────────┐
            │                 │    backend-users     │
            │                 │    (NestJS 11)       │
            │                 │  · Google OAuth 2.0  │
            │                 │  · JWT auth          │
            │                 │  · Dashboard data    │
            │                 └──────────┬───────────┘
            │                            │ Authorization Bearer
            │                            ▼
            │                 ┌─────────────────────┐
            ▼                 │   backend-services  │
   ┌──────────────────┐       │   (Express 5 + TS)  │
   │backend-redirector│       │  · Hexagonal + DDD  │
   │   (Fastify 5)    │       │  · URL shortening   │
   │  · Thin handler  ├──────►│  · Visit tracking   │
   │  · HTTP 302/410  │       │  · Geolocation      │
   └──────────────────┘       └──────────┬───────────┘
                                         │ Drizzle ORM
                                         ▼
                              ┌─────────────────────┐
                              │     PostgreSQL 16   │
                              │  short_urls, visits │
                              └─────────────────────┘
```

### Redirect Flow (Synchronous Click Tracking — ADR-006)

1. User visits `http://localhost:3002/:slug` → **backend-redirector** (Fastify 5).
2. Handler makes an internal call to **backend-services** (`GET /internal/slug-data/:slug`) passing `Authorization: Bearer <INTERNAL_SECRET>`.
3. **backend-services** executes `VisitShortUrl.usecase`:
   - Validates link status (active, password, expired, deleted).
   - Resolves IP geolocation offline (`geoip-lite`) and parses User-Agent metadata.
   - **Atomically inserts visit event and increments `clicks_count`** in PostgreSQL using a single Drizzle DB transaction.
4. **backend-redirector** receives response:
   - Active link → HTTP `302 Found` to `originalUrl`.
   - Password-protected → HTTP `302 Found` to `/password-protected`.
   - Expired / Deleted → HTTP `410 Gone`.

---

## 🛠 Tech Stack

### Backend

| Application          | Framework      | Role                                         | Architecture                 |
| -------------------- | -------------- | -------------------------------------------- | ---------------------------- |
| `backend-services`   | Express 5 + TS | Core shortening & click tracking engine      | Hexagonal Architecture + DDD |
| `backend-redirector` | Fastify 5 + TS | High-performance thin redirect engine        | Thin Adapter                 |
| `backend-users`      | NestJS 11      | Auth & user management (legacy → rebuilding) | Modular Monolith             |

### Frontend

| Application          | Framework                                | Role                    |
| -------------------- | ---------------------------------------- | ----------------------- |
| `frontend-landing`   | Astro 7 + React 19 Islands + Tailwind v4 | Public landing page     |
| `frontend-dashboard` | React 19 + Vite + TanStack Query         | Analytics dashboard SPA |

### Shared Packages

| Package              | Role                                                                     |
| -------------------- | ------------------------------------------------------------------------ |
| `@min-url/contracts` | Zod schemas, DTOs, `httpUrlSchema`, error codes, shared analytics tuples |

### Infrastructure

| Technology         | Role                                                |
| ------------------ | --------------------------------------------------- |
| **PostgreSQL 16**  | Relational database (short_urls & visits)           |
| **Drizzle ORM**    | Type-safe SQL-first ORM with partitioned migrations |
| **Docker Compose** | Local dev infrastructure (PostgreSQL 16 + Redis)    |

### Key Libraries

- **Validation**: `@min-url/contracts`, `zod`
- **Captcha**: Cloudflare Turnstile (`@challenges.cloudflare.com`)
- **Analytics**: `geoip-lite` (offline geolocation)
- **Tooling**: Turborepo 2.x, Bun 1.x, Biome (linting), Prettier (formatting), Vitest, Playwright

---

## 📁 Project Structure

```text
min-url/
├── apps/
│   ├── backend-services/     # Express 5 + TS — Hexagonal + DDD Core
│   │   ├── src/
│   │   │   ├── core/         # Domain (Entities, VOs, Domain Services, Ports, UseCases)
│   │   │   └── adapters/     # Primary (HTTP Controllers/Routes) & Secondary (Drizzle DB, GeoIP)
│   │   └── db/migrations/    # Partitioned Drizzle migrations (/core & /analytics)
│   │
│   ├── backend-redirector/   # Fastify 5 + TS — Thin Redirect Engine
│   │
│   ├── backend-users/        # NestJS 11 — Auth & User Management (legacy)
│   │
│   ├── frontend-landing/     # Astro 7 + React 19 Islands + Tailwind v4
│   │
│   └── frontend-dashboard/   # React 19 + Vite — Dashboard SPA (legacy)
│
├── packages/
│   └── contracts/            # @min-url/contracts — Zod schemas, DTOs, error codes
│
├── tests/                    # Playwright E2E integration tests
├── docs/                     # Internal documentation in Spanish (plan, ADRs, audit)
├── .github/                  # CI workflows & PR template
├── turbo.json                # Turborepo pipeline configuration
└── package.json              # Monorepo root configuration
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) ≥ 20
- [Bun](https://bun.sh) ≥ 1.2.9
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (for Postgres + Redis)

### 1. Clone & Install

```bash
git clone https://github.com/PaoloHerrera/min-url.git
cd min-url
bun install
```

### 2. Start the Database

### 2. Start Infrastructure (PostgreSQL 16 & Redis)

```bash
# From the monorepo root
docker compose up -d
```

This spins up:

- **PostgreSQL 16** on port `5432` (`min_url` database)
- **Redis** on port `6379`

### 3. Run Database Migrations

```bash
# Apply core & analytics Drizzle ORM migrations
cd apps/backend-services && bun run db:migrate
```

### 4. Start All Services

```bash
# From the monorepo root
bun run dev
```

Turborepo will start the applications concurrently:

| Service              | Port   | Default URL           | Role                                      |
| -------------------- | ------ | --------------------- | ----------------------------------------- |
| `frontend-landing`   | `4321` | http://localhost:4321 | Public Astro landing page                 |
| `backend-services`   | `3001` | http://localhost:3001 | Express 5 core API (Hexagonal + DDD)      |
| `backend-redirector` | `3002` | http://localhost:3002 | Fastify 5 redirect engine                 |
| `backend-users`      | `3000` | http://localhost:3000 | NestJS auth service (legacy → rebuilding) |
| `frontend-dashboard` | `5173` | http://localhost:5173 | React 19 analytics dashboard (legacy)     |

---

## 🗄 Database Schema & Migrations

PostgreSQL 16 persistence is managed via **Drizzle ORM** with partitioned migrations (ADR-004):

```text
db/migrations/
├── core/         # short_urls table (slug, original_url, clicks_count, limits)
└── analytics/    # visits table (short_url_id, IP, UA, Referer, Geolocation)
```

---

## 🧑‍💻 Development Commands

```bash
# Run unit & integration tests across all packages
bun run test

# Run strict TypeScript typechecking
bun run typecheck

# Run Biome linter across workspace
bun run lint
```

### Run individual services

```bash
# Backend users only
cd backend-users && bun run dev

# Backend services only
cd backend-services && bun run dev

# Dashboard only
cd frontend-dashboard && bun run dev
```

### Linting

```bash
# From root (runs Biome on all packages)
bun run biome
```

### Build

```bash
# Production build of all packages
bun run build
```

---

## 🗺 Roadmap

- [ ] Password-protected URL unlock flow (UI)
- [ ] Automatic URL expiration cron job
- [ ] GitHub OAuth login
- [ ] Public API access (purpose: `api`)
- [ ] Real-time notifications via WebSocket
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Unit test coverage

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

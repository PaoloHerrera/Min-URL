<div align="center">

# 🔗 Min-URL

**A modern, full-stack URL shortener & QR Code generator with real-time analytics**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E=20-green.svg)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.4.4-blueviolet.svg)](https://turbo.build)
[![Bun](https://img.shields.io/badge/Bun-1.2.9-orange.svg)](https://bun.sh)

[Features](#-features) · [Architecture](#-architecture) · [Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure)

</div>

---

## ✨ Features

- 🔗 **URL Shortener** — Generate short links with random or custom slugs
- 📷 **QR Code Generator** — Create QR codes with custom foreground/background colors
- 📊 **Analytics Dashboard** — Real-time stats: total clicks, today's activity, geographic distribution, device breakdown
- 🌍 **Geolocation Tracking** — Offline IP-to-location mapping (no external API required)
- ⚡ **Async Click Tracking** — Non-blocking redirect flow via Redis Pub/Sub
- 🔐 **Google OAuth 2.0** — Secure authentication with JWT (httpOnly cookies)
- 🌐 **i18n** — English and Spanish support
- 🌙 **Dark Mode** — Fully themed with light/dark mode toggle
- 🚦 **Rate Limiting** — Per-user URL quotas and per-IP throttling
- 🔒 **Password-protected URLs** — Schema-level support (UI in progress)

---

## 🏗 Architecture

Min-URL is a **Turborepo monorepo** composed of five independent packages:

```
┌──────────────────────────────────────────────────────────────────┐
│                         END USER                                 │
└────────────┬───────────────────────────┬─────────────────────────┘
             │                           │
             ▼                           ▼
   ┌──────────────────┐       ┌─────────────────────┐
   │ frontend-landing │       │  frontend-dashboard  │
   │  (React + Vite)  │       │  (React + Vite + RQ) │
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
            │                 │  · Proxy → services  │
            │                 └──────────┬───────────┘
            │                            │ X-API-Key
            │                            ▼
            │                 ┌─────────────────────┐
            ▼                 │   backend-services  │◄── Redis Sub
   ┌──────────────────┐       │   (Express.js)      │
   │backend-redirector│       │  · URL/QR CRUD      │
   │   (Remix SSR)    │       │  · Slug generation  │
   │  · Redirects     │       │  · Geo middleware    │
   │  · Click events  │       │  · Click storage     │
   └────────┬─────────┘       └──────────┬───────────┘
            │                            │
            │  Redis Pub                 ▼
            └──────────────► ┌─────────────────────┐
                             │        Redis        │
                             │    (Pub/Sub)        │
                             └──────────┬───────────┘
                                        │
                             ┌──────────▼──────────┐
                             │     PostgreSQL 16    │
                             │  users, urls,        │
                             │  short_urls, qr_codes│
                             │  clicks, geolocations│
                             └─────────────────────┘
```

### Redirect Flow (click tracking)

1. User visits `your-domain.com/SLUG` → **backend-redirector** (Remix SSR)
2. Loader fetches slug metadata from **backend-services** via API Key
3. If no password: **publish click event to Redis** → immediate HTTP 302 redirect
4. **backend-services** (Redis subscriber) asynchronously writes Click + ClickDetail + Geolocation to Postgres
5. ✅ Zero blocking on the redirect path

---

## 🛠 Tech Stack

### Backend

| Package | Framework | Role |
|---|---|---|
| `backend-users` | NestJS 11 | Authentication, user management, dashboard data aggregation |
| `backend-services` | Express 4 | URL/QR CRUD, slug generation, click processing |
| `backend-redirector` | Remix 2 | SSR redirect engine, click event publishing |

### Frontend

| Package | Framework | Role |
|---|---|---|
| `frontend-dashboard` | React 19 + Vite 6 | Analytics dashboard SPA |
| `frontend-landing` | React 19 + Vite 6 | Public landing page |

### Infrastructure

| Technology | Role |
|---|---|
| **PostgreSQL 16** | Primary relational database |
| **Redis** | Pub/Sub for async click processing |
| **Docker Compose** | Local development infrastructure |
| **Sequelize 6** | ORM (shared across Node.js services) |

### Key Libraries

- **Auth**: `passport-google-oauth20`, `@nestjs/jwt`, `passport-jwt`
- **Validation**: `zod`, `validator`, `express-rate-limit`, `@nestjs/throttler`
- **Analytics**: `geoip-lite`, `ua-parser-js`, `isbot`
- **Frontend**: TanStack Query v5, Zustand 5, Recharts, Radix UI, Framer Motion, Tailwind CSS v4
- **QR**: `qrcode` (server-side), `react-qr-code` (preview)
- **Tooling**: Turborepo, Bun, Biome (lint + format)

---

## 📁 Project Structure

```
min-url/
├── backend-redirector/      # Remix SSR — URL redirect engine
│   └── app/
│       ├── routes/
│       │   ├── $slug.tsx    # Dynamic redirect + click tracking
│       │   └── _index.tsx   # Root redirect
│       ├── config/redis.ts  # Redis publisher
│       └── utils/           # Device detection, IP utils
│
├── backend-services/        # Express.js — Core API
│   ├── controllers/         # UrlController, UserController
│   ├── middleware/          # Auth, validation, geo, rate limit
│   ├── models/              # Sequelize models (7 tables)
│   ├── services/            # Business logic, SlugGenerator
│   ├── config/              # DB + Redis setup
│   └── index.js             # Entry point
│
├── backend-users/           # NestJS 11 — Auth & user API
│   └── src/
│       ├── auth/            # Google OAuth, JWT strategies
│       ├── protected/       # Dashboard data, URL proxy
│       ├── user/            # User model
│       ├── refreshToken/    # Token rotation
│       └── dashboard/       # WebSocket gateway (WIP)
│
├── frontend-dashboard/      # React SPA — Analytics dashboard
│   └── src/
│       ├── modules/
│       │   ├── core/        # Hooks, services, i18n, design system
│       │   ├── dashboard/   # KPIs, charts, top links
│       │   ├── link/        # Links management page
│       │   ├── qrcodes/     # QR codes management page
│       │   ├── createNew/   # Create link/QR dialogs
│       │   ├── navbar/      # Top navigation
│       │   └── sidebar/     # Usage stats sidebar
│       ├── stores/          # Zustand global state
│       └── types.d.ts       # Shared TypeScript types
│
├── frontend-landing/        # React SPA — Public landing page
│   └── src/modules/home/
│
├── db/
│   ├── init.sql             # Full schema + indexes + views
│   └── docker-compose.yml   # Postgres 16 + Redis
│
├── turbo.json               # Turborepo pipeline config
├── biome.json               # Linting + formatting config
└── package.json             # Workspace root
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) ≥ 20
- [Bun](https://bun.sh) ≥ 1.2.9
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (for Postgres + Redis)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/min-url.git
cd min-url
bun install
```

### 2. Start the Database

```bash
cd db
docker compose up -d
```

This spins up:
- **PostgreSQL 16** on port `5432` (auto-initialized with `init.sql`)
- **Redis** on port `6379`

### 3. Configure Environment Variables

Each service has its own `.env` file. Copy the examples and fill in your values:

**`backend-users/.env`**
```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASS=admin
DB_NAME=Min-URL
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
DASHBOARD_URL=http://localhost:5173
LOGIN_URL=http://localhost:5173/login
API_URL=http://localhost:3000
API_KEY=your_internal_api_key
REDIRECTOR_URL=http://localhost:5174
```

**`backend-services/.env`**
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASS=admin
DB_NAME=Min-URL
REDIS_URL=localhost
REDIS_PORT=6379
SESSION_SECRET=your_session_secret
API_KEY=your_internal_api_key
REDIRECTOR_URL=http://localhost:5174
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**`backend-redirector/.env.development`**
```env
VITE_API_URL=http://localhost:3000
VITE_API_KEY=your_internal_api_key
VITE_LOCAL_IP=127.0.0.1
REDIS_URL=localhost
REDIS_PORT=6379
```

**`frontend-dashboard/.env.development`**
```env
VITE_API_URL=http://localhost:3001
```

### 4. Run All Services

```bash
# From the monorepo root
bun run dev
```

Turborepo will start all five packages concurrently:

| Service | URL |
|---|---|
| `frontend-dashboard` | http://localhost:5173 |
| `backend-users` | http://localhost:3001 |
| `backend-services` | http://localhost:3000 |
| `backend-redirector` | http://localhost:5174 |
| `frontend-landing` | http://localhost:5175 |

### 5. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add `http://localhost:3001/auth/google/callback` as an authorized redirect URI
4. Copy your Client ID and Client Secret to `backend-users/.env`

---

## 🗄 Database Schema

The database uses a `"Min-URL"` schema in PostgreSQL with the following tables:

```
users ──────────────────────────────────────────────┐
  └── refresh_tokens                                 │
  └── urls ──────────────────────────────────────┐   │
        ├── short_urls                           │   │
        ├── qr_codes                             │   │
        └── clicks ──────────────────────────┐  │   │
              └── clicks_details ──────────┐ │  │   │
                    └── geolocations ◄─────┘ │  │   │
                                             └──┘   │
                                                    └─ (FK user_id)
```

**6 pre-built SQL views** power the analytics dashboard:
- `dashboard_cards_view` — KPI aggregates per user
- `dashboard_last_7_days_clicks_view` — Daily click trends
- `dashboard_countries_view` — Geographic distribution
- `dashboard_devices_view` — Device breakdown
- `dashboard_top_links_view` — Most clicked short URLs
- `dashboard_top_qr_codes_view` — Most scanned QR codes

---

## 🧑‍💻 Development

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

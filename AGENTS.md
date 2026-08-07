# AGENTS.md — Min-URL

Context for AI-assisted development sessions. Read this before making changes.

## What this project is

Min-URL is a URL shortener built as a **software engineering lab and portfolio piece**. It is a Turborepo monorepo (Bun workspaces) with 3 backends and 2 frontends. Every significant decision must be traceable: the project values **documented reasoning (ADRs), real tests (TDD), and measured performance** over feature count.

## Documentation map (the source of truth, in order)

1. `docs/plan_refactor.md` — **the bible**: 4 chapters, 60+ numbered steps with status. Update step status when completing work.
2. `docs/adr/` — ADR-001..006. **Never edit accepted ADRs retroactively**; write a new ADR for new decisions.
3. `docs/auditoria-tecnica-2026-07.md` — technical audit with a **remediation tracker**; mark items ✅ as they get fixed.
4. `docs/casos_de_uso_mvp.md` — use cases with real flows and SLOs.
5. `docs/SECURITY.md` — security policy and known debt.
6. `personal_notes/roadmap_and_tracker.md` — **mirror of GitHub** (local-only, gitignored). It is the **photo of where we are**: a consolidated roadmap + issue/PR tracker that reflects the real state of GitHub. Whenever you open, close, or merge an issue/PR, update it to match GitHub — it must never describe work that doesn't exist there.

## Repo layout

```
apps/
  backend-services/     # Express 5 + TS strict. HEXAGONAL + DDD core (see below)
  backend-redirector/   # Fastify 5 + TS strict. Thin redirect service
  backend-users/        # NestJS 11. LEGACY scaffold → being rebuilt (better-auth)
  frontend-landing/     # Astro 7 + React 19 islands + Tailwind v4 + daisyUI
  frontend-dashboard/   # React 19 + Vite. LEGACY → reconnect with TanStack Query
packages/
  contracts/            # @min-url/contracts — Zod schemas, DTOs, error codes (shared)
tests/                  # Playwright E2E
```

## Hard rules

- **Hexagonal boundaries in `backend-services`**: nothing from `express`, `drizzle-orm`, `pg`, or `geoip-lite` may be imported under `src/core/`. Dependencies point inward only. Infrastructure lives in `src/adapters/`; wiring in `src/bootstrap.ts`.
- **Business rules live in the domain** (entities/VOs/domain services), never in middlewares or controllers.
- **Validation at boundaries with `@min-url/contracts`** — do not duplicate Zod schemas locally in apps; add/extend the contracts package instead.
- **Never commit secrets.** All `.env*` are gitignored; keep it that way. Turnstile test keys (`1x000...`) are for dev/CI only.
- **TDD**: write/adjust tests with the feature. Unit tests of use cases use in-memory port implementations (no `vi.mock` of file paths).
- Commits: **Conventional Commits** (commitlint enforced). PRs use the template in `.github/PULL_REQUEST_TEMPLATE.md` and **must close an issue** (`Closes #`).
- Language: code and public README in English; internal docs (`docs/`) in Spanish.
- Formatting/linting: Biome (lint) + Prettier (format). Tabs, per `biome.json`/`.prettierrc`.

## Commands

```bash
bun install
docker compose up -d     # PostgreSQL 16 + Redis
bun run dev              # all apps via Turborepo
bun run test             # unit + integration (per package)
bun run typecheck        # strict TS, all packages
bun run lint             # Biome
bunx playwright test     # E2E (needs dev servers / see playwright.config.ts)
```

Default ports: landing `:4321` · backend-services `:3001` (env `PORT`) · redirector `:3002`.

## Current priorities (Fase 0 — see audit tracker)

1. **Issue #40: Graceful Shutdown**: Implement SIGTERM/SIGINT signal listeners and clean teardown for PostgreSQL connections in `backend-services`.
2. Security fixes: CORS whitelist in backend-users, timing-safe internal token, `httpUrlSchema` in contracts, `trust proxy 1`.
3. Rate limiting in backend-services **before** implementing `verify-password` (ADR-003: non-negotiable).
4. Fix `playwright.yml` in CI (it references a non-existent `init.sql`).
5. Complete plan step 4 (410 handling, contracts in redirector, `RedirectionService`) and step 5 (`/password-protected`, contracts in landing).

## Known gotchas

- `backend-services` environment loading is fully decoupled via `loadEnv()` and `parseEnv()` at bootstrap (Issue #41).
- `backend-users` is a **mock**: `validateUser` returns `idUsers: 1` and `ProtectedService` is stubs. Do not build on top of it — it gets rebuilt in Part 1B.
- The dashboard talks to a hardcoded `localhost:3000` legacy API; treat it as legacy until the Part 1B reconnect.
- Click tracking is intentionally **synchronous** in Chapter 1 (ADR-006); only make it async if Chapter 2 measurements justify it.

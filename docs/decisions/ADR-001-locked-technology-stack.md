# ADR-001 — Locked technology stack (Phase 0.1)

## Status

Accepted — 2026-05-03

## Context

EduTrack Africa needs a single, stable stack before implementation proceeds. Phase 0.1 of the roadmap requires locking choices to avoid costly pivots later.

## Decision

The following technologies are **locked** for this repository unless superseded by a new ADR with explicit migration rationale.

| Area | Choice | Notes |
|------|--------|------|
| **Web UI** | **Next.js 16** (App Router) + **React 19** + **TypeScript 5** | Satisfies roadmap requirement for React + TypeScript; already scaffolded in `apps/web`. |
| **Desktop shell** | **Tauri** | Lightweight, offline-friendly; to be integrated under `apps/desktop/` in Phase 9. Integration with Next.js will use a documented approach (e.g. static export or embedded web content) at that phase. |
| **Styling** | **Tailwind CSS v4** | Already configured in `apps/web`. |
| **Backend runtime** | **Node.js 20 LTS** (target) + **Fastify** | TypeScript-aligned HTTP API in `apps/api/` (to be added from Phase 1 onward). |
| **Database (local / desktop)** | **SQLite** via **`better-sqlite3`** | Offline-first local store. |
| **Database (cloud)** | **PostgreSQL** | **Supabase** acceptable for development hosting; production host TBD. |
| **ORM** | **Drizzle ORM** | SQLite + PostgreSQL support; shared schema in `packages/db/` when the monorepo is wired (Phase 0.2+). |
| **PDF generation** | **`@react-pdf/renderer`** | Transcripts and school documents. |
| **Excel** | **SheetJS (`xlsx`)** | Import/export templates per roadmap Phase 8. |
| **Authentication** | **JWT** signed/verified with **`jose`**; passwords **bcrypt** (≥12 rounds in Phase 2) | Self-hosted auth only; no third-party IdP required for core flows. |
| **Internationalization** | **`i18next`** + **`react-i18next`** | **French (`fr`)** is the default locale; keys for all user-facing copy. |
| **Testing** | **Vitest** + **Testing Library** (unit/integration); **Playwright** (E2E) | Aligns with roadmap Phase 0.1 / 14. |

## Rejected / deferred (for this ADR)

- **Vue, Angular, plain JS** — rejected for the primary UI stack.
- **Electron** — rejected in favor of Tauri for the desktop shell (size and resource profile).
- **Python + FastAPI** — deferred; team standard is Node + Fastify for shared TS types and tooling.
- **Prisma** — deferred; Drizzle chosen per roadmap for weight and dual-dialect support.

## Consequences

- New packages and services must fit this table or go through a new ADR.
- The UML document §13 still lists alternatives (e.g. Prisma, Puppeteer); **this ADR overrides** those options where they conflict.
- Phase 9 must document how the Next.js app is packaged inside Tauri (build/export strategy).

## References

- `docs/SchoolMS_Roadmap.md` — Phase 0.1 checklist
- `docs/SchoolMS_UML_Design.md` — §13 Technology stack recommendation

## Related

- Phase 0.2 monorepo layout: root `pnpm-workspace.yaml`, `apps/*`, `packages/*`, `scripts/`, `.github/workflows/ci.yml`.
- Phase 0.3 coding standards: root [`CONTRIBUTING.md`](../../CONTRIBUTING.md).

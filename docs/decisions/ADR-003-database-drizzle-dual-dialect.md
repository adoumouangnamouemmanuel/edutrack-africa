# ADR-003 — Drizzle ORM with SQLite + PostgreSQL (Phase 0.5)

## Status

Accepted — 2026-05-03

## Context

The product is offline-first (SQLite on desktop) and cloud-capable (PostgreSQL). Phase 0.5 requires migrations and seeds to work in both environments.

## Decision

- **ORM:** **Drizzle ORM** in `packages/db`.
- **Two schema modules:** `src/schema/sqlite.ts` and `src/schema/pg.ts` stay aligned manually (same tables/columns, dialect-appropriate types).
- **Two migration folders:** `drizzle/sqlite/` and `drizzle/pg/`, generated with separate `drizzle-kit` configs.
- **Drivers:** `better-sqlite3` for local SQLite file; `pg` + `drizzle-orm/node-postgres` for PostgreSQL.
- **SQLite FK ordering:** Generated SQL may list child tables before parents; the initial SQLite migration is **ordered** for valid inline foreign keys (see `docs/database/schema-overview.md`).

## Consequences

- Schema changes require updating **both** `sqlite.ts` and `pg.ts`, then running `pnpm db:generate` and reviewing both SQL outputs.
- A future improvement is a single source of truth (codegen or SQL-first) once the schema stabilizes in Phase 1.

## References

- `docs/SchoolMS_Roadmap.md` — Phase 0.5
- `docs/database/schema-overview.md`

# ADR-002 — Development tooling (Phase 0.4)

## Status

Accepted — 2026-05-03

## Context

Contributors need consistent formatting, fast feedback before push, CI that matches local checks, and documented environment variables.

## Decision

| Concern               | Choice                                                                                                                                 |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Formatter             | **Prettier** — single `prettier.config.mjs` at repo root; `pnpm format` / `pnpm format:check`.                                         |
| Lint (web)            | **ESLint 9** (flat config) via `eslint-config-next` + **`eslint-config-prettier`** (last in config) so Prettier owns formatting rules. |
| Lint (API / packages) | **`tsc --noEmit`** where no ESLint project is configured yet; extend with ESLint later if needed.                                      |
| Git hooks             | **Husky** + **lint-staged** — on commit: Prettier on staged text files; ESLint `--fix` on staged `apps/web` TypeScript.                |
| Unit tests            | **Vitest** — `vitest run` from repo root; initial test in `@edutrack/shared`. CI runs `pnpm test`.                                     |
| CI                    | **GitHub Actions** — install with frozen lockfile, then `format:check`, `lint`, `test` (extends Phase 0.2 lint-only workflow).         |
| Env docs              | **`.env.example`** at repo root plus `apps/web/.env.example` and `apps/api/.env.example`; root file is canonical.                      |

## Consequences

- First-time clone: run `pnpm install` (runs `prepare` → Husky). If hooks are unwanted in a sandbox, use `HUSKY=0 git commit` or `pnpm install --ignore-scripts` (not recommended for normal dev).
- Prettier may reformat large areas once; after that, `format:check` in CI keeps diffs stable.

## References

- `docs/SchoolMS_Roadmap.md` — Phase 0.4
- `CONTRIBUTING.md` — contributor expectations

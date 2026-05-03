# Contributing to EduTrack Africa

This document encodes **Phase 0.3** coding standards for the monorepo. Changes that conflict with these rules should be discussed and recorded in `docs/decisions/` (ADR) before merging.

## Naming conventions

| Context | Convention | Examples |
|--------|--------------|----------|
| Variables, functions, hooks, file names (non-React) | `camelCase` | `studentId`, `loadTranscript()` |
| React components, classes, TypeScript types/interfaces | `PascalCase` | `GradeEntryTable`, `TranscriptLine` |
| Database columns, SQL, Drizzle schema column names | `snake_case` | `first_name`, `school_id`, `created_at` |
| Route path segments | `kebab-case` is acceptable for URLs; map to `camelCase` in handlers | `/transcript-lines` → `transcriptLineId` in code |

Use meaningful full words where practical; avoid obscure abbreviations unless they are domain-standard (e.g. `fcfa`, `xaf`).

## File and module structure

- **One main React component per file.** Small colocated helpers are fine; split large UIs into subcomponents in their own files.
- **One service per file** in the API (e.g. `school.service.ts`). Routers stay thin; business logic lives in services.
- **One repository per aggregate** where persistence is non-trivial (e.g. `school.repository.ts`), or follow the existing module layout in `apps/api/src/` as it evolves.

## Git branches

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready releases |
| `develop` | Integration branch for ongoing work |
| `feature/<short-description>` | New features |
| `fix/<short-description>` | Bug fixes |

Use short, hyphenated descriptions (e.g. `feature/grade-entry-autosave`).

## Commit messages

Use lowercase [Conventional Commits](https://www.conventionalcommits.org/) prefixes:

- `feat:` — new user-visible behavior or API capability
- `fix:` — bug fix
- `chore:` — tooling, deps, refactors without behavior change
- `docs:` — documentation only
- `test:` — tests only

Examples: `feat: validate transcript line payload`, `fix: rank tie when averages match`.

## API rules (required)

1. **Every HTTP route must validate input** (query, params, body) with a typed schema (e.g. **Zod**) before calling services.
2. **No raw SQL or ad hoc DB access inside route handlers.** Handlers call services; services use repositories or Drizzle query builders defined in `packages/db` (or the agreed data layer).

## Money and numeric grades (required)

Floating-point types must not represent money or stored grades.

- **Money (fees, salaries, payments):** store as **integers in the smallest currency unit** (e.g. FCFA has no minor unit — store whole francs as integers; if you ever need sub-franc, use an explicit documented scale).
- **Grades (0–20 scale):** store as **integers in hundredths of a point** (e.g. `14.50` → `1450`). The UI and PDF layers format for display (including French decimal comma where needed).

Document any new monetary or grade field in schema comments and in API types shared via `@edutrack/shared`.

## Internationalization (required)

- **Default staff-facing locale is French** (`fr`), per product goals.
- **Do not hardcode user-visible copy in JSX or API error payloads.** Use **i18n keys** (`i18next` / `react-i18next` on the web app; a parallel pattern for API messages once wired in Phase 2+). French (and other languages) live in translation resources, keyed by stable IDs (e.g. `errors.validation.firstNameRequired`).
- **Until `react-i18next` is installed**, keep all French (and other) UI strings in dedicated locale modules under the app (e.g. `apps/web/lib/locales/fr.ts`). Components import from those modules only — no new French sentence literals inside `app/**/*.tsx` or scattered component files.
- Technical logs and developer-only messages may remain in English.

## Reviews and tests

- Prefer small PRs that match one feature or fix.
- Add or update tests when behavior changes (Vitest / Playwright per `docs/decisions/ADR-001-locked-technology-stack.md`).

## Where to get help

- Roadmap: `docs/SchoolMS_Roadmap.md`
- Architecture / UML: `docs/SchoolMS_UML_Design.md`
- Locked stack: `docs/decisions/ADR-001-locked-technology-stack.md`

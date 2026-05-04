# Database schema (Phase 0.5)

This document tracks the first three tables introduced for EduTrack Africa. Column names use **`snake_case`** in SQL (see `CONTRIBUTING.md`).

## `school`

| Column                                     | Type (SQLite / PG)                 | Notes                                                                            |
| ------------------------------------------ | ---------------------------------- | -------------------------------------------------------------------------------- |
| `id`                                       | `TEXT` / `text`                    | Primary key, UUID string                                                         |
| `name`                                     | text                               | Required                                                                         |
| `short_name`                               | text                               | Optional                                                                         |
| `logo_url`                                 | text                               | Optional                                                                         |
| `address`, `city`                          | text                               | Optional                                                                         |
| `country`                                  | text                               | Default `TD`                                                                     |
| `phone`, `email`, `motto`, `ministry_code` | text                               | Optional                                                                         |
| `school_type`                              | text                               | Default `public` (`public` \| `private` \| `religious` conventions in app layer) |
| `default_language`                         | text                               | Default `fr`                                                                     |
| `created_at`                               | integer (epoch ms) / `timestamptz` | Set on insert                                                                    |

## `academic_year`

| Column                   | Type                        | Notes                                              |
| ------------------------ | --------------------------- | -------------------------------------------------- |
| `id`                     | text PK                     | UUID                                               |
| `school_id`              | text FK → `school.id`       | `ON DELETE CASCADE`                                |
| `label`                  | text                        | e.g. `2025–2026`                                   |
| `start_date`, `end_date` | text                        | ISO date strings (`YYYY-MM-DD`)                    |
| `is_current`             | integer boolean / `boolean` |                                                    |
| `grading_system`         | text                        | Default `trimesters` (`trimesters` \| `semesters`) |

## `user`

| Column                   | Type                        | Notes                                                  |
| ------------------------ | --------------------------- | ------------------------------------------------------ |
| `id`                     | text PK                     | UUID                                                   |
| `school_id`              | text FK → `school.id`       | `ON DELETE CASCADE`                                    |
| `username`               | text                        | Unique together with `school_id`                       |
| `password_hash`          | text                        | Never store plaintext (seed uses bcrypt for demo only) |
| `role`                   | text                        | `school_master` \| `teacher` \| `student`              |
| `is_active`              | integer boolean / `boolean` | Default true                                           |
| `last_login`             | integer ms / `timestamptz`  | Optional                                               |
| `created_at`             | integer ms / `timestamptz`  |                                                        |
| `digital_signature_cert` | text                        | Optional (Phase 12)                                    |

## Migrations layout

| Dialect    | Drizzle output                | Apply                                          |
| ---------- | ----------------------------- | ---------------------------------------------- |
| SQLite     | `packages/db/drizzle/sqlite/` | `pnpm db:migrate`                              |
| PostgreSQL | `packages/db/drizzle/pg/`     | `pnpm db:migrate:pg` (`DATABASE_URL` required) |

### SQLite migration order

`drizzle-kit generate` may emit `CREATE TABLE` statements in an order that breaks inline foreign keys on SQLite. The committed `0000_*.sql` for SQLite is **manually ordered** (`school` → `academic_year` → `user`). After regenerating, verify FK order before committing.

## Seed data

- **SQLite:** `pnpm db:seed` (after `pnpm db:migrate`)
- **PostgreSQL:** `pnpm db:seed:pg` (after `pnpm db:migrate:pg`)

Creates a demo school **Lycée Félix Éboué de N'Djamena**, one academic year **2025–2026**, and user **`directeur.demo`** (password **`ChangeMoi2026!`** — change immediately outside local dev).

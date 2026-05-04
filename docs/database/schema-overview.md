# EduTrack Africa Database Schema

Complete documentation of all database tables, columns, indexes, and constraints for the school management system.

---

## Table of Contents

1. [Overview](#overview)
2. [Core Tables](#core-tables)
3. [Week 3 Entities](#week-3-entities)
4. [Indexes & Performance](#indexes--performance)
5. [Constraints & Data Integrity](#constraints--data-integrity)
6. [Migrations](#migrations)
7. [Entity-Based Architecture](#entity-based-architecture)

---

## Overview

**Status:** Phase 1.1 Week 3 Complete (May 4, 2026)

EduTrack Africa uses a dual-database architecture:

- **SQLite** (`better-sqlite3`): Local/desktop database for offline-first functionality
- **PostgreSQL**: Cloud database for multi-school federation and synchronization

Both dialects maintain identical schemas through entity-based definitions in `packages/db/src/schema/entities/`.

### Naming Conventions

- **Database columns**: `snake_case` (e.g., `school_id`, `is_current`)
- **Tables**: `snake_case` (e.g., `academic_year`, `class_level`)
- **Indexes**: `{table}_{columns}_{type}` (e.g., `term_academic_year_id_label_unique`)
- **Foreign keys**: `{table}_{column}_{ref_table}_{ref_column}_fk`

---

## Core Tables

### `school`

Root entity for multi-tenancy. Every other table references a school.

| Column             | Type                  | Constraints      | Notes                                  |
| ------------------ | --------------------- | ---------------- | -------------------------------------- |
| `id`               | TEXT / text           | PRIMARY KEY      | UUID, auto-generated                   |
| `name`             | TEXT / text           | NOT NULL         | e.g., "Lycée Félix Éboué de N'Djamena" |
| `short_name`       | TEXT / text           | —                | e.g., "LFEN"                           |
| `logo_url`         | TEXT / text           | —                | S3/CDN URL for school logo             |
| `address`          | TEXT / text           | —                | Physical school address                |
| `city`             | TEXT / text           | —                | City name                              |
| `country`          | TEXT / text           | DEFAULT 'TD'     | ISO country code                       |
| `phone`            | TEXT / text           | —                | Contact phone number                   |
| `email`            | TEXT / text           | —                | Contact email                          |
| `motto`            | TEXT / text           | —                | School motto in French                 |
| `ministry_code`    | TEXT / text           | —                | Government registration code           |
| `school_type`      | TEXT / text           | DEFAULT 'public' | `public` \| `private` \| `mission`     |
| `default_language` | TEXT / text           | DEFAULT 'fr'     | `fr` \| `ar` \| `en`                   |
| `created_at`       | INTEGER / timestamptz | NOT NULL         | Set on insert, never updated           |

**Purpose:** Configuration hub for each school's system.

---

### `academic_year`

Groups terms within a school's academic calendar (e.g., 2025–2026).

| Column           | Type                  | Constraints                 | Notes                       |
| ---------------- | --------------------- | --------------------------- | --------------------------- |
| `id`             | TEXT / text           | PRIMARY KEY                 | UUID                        |
| `school_id`      | TEXT / text           | FK → `school.id` ON CASCADE | Non-null                    |
| `label`          | TEXT / text           | NOT NULL                    | e.g., "2025–2026"           |
| `start_date`     | TEXT / text           | —                           | ISO date: YYYY-MM-DD        |
| `end_date`       | TEXT / text           | —                           | ISO date: YYYY-MM-DD        |
| `is_current`     | INTEGER / boolean     | DEFAULT false               | Only one per school         |
| `grading_system` | TEXT / text           | DEFAULT 'trimesters'        | `trimesters` \| `semesters` |
| `created_at`     | INTEGER / timestamptz | NOT NULL                    | Set on insert               |

---

### `user`

Authentication and authorization for all roles (school_master, teacher, student).

| Column                   | Type                  | Constraints                  | Notes                                     |
| ------------------------ | --------------------- | ---------------------------- | ----------------------------------------- |
| `id`                     | TEXT / text           | PRIMARY KEY                  | UUID                                      |
| `school_id`              | TEXT / text           | FK → `school.id` ON CASCADE  | Non-null                                  |
| `username`               | TEXT / text           | NOT NULL + UNIQUE per school | For login                                 |
| `password_hash`          | TEXT / text           | NOT NULL                     | bcrypt(12) rounds minimum                 |
| `role`                   | TEXT / text           | NOT NULL                     | `school_master` \| `teacher` \| `student` |
| `is_active`              | INTEGER / boolean     | DEFAULT true                 | Soft delete via flag                      |
| `last_login`             | INTEGER / timestamptz | —                            | Nullable, updated on auth                 |
| `created_at`             | INTEGER / timestamptz | NOT NULL                     | Set on insert                             |
| `digital_signature_cert` | TEXT / text           | —                            | PEM certificate (Phase 12)                |

**Unique constraint**: `(school_id, username)` — each school has unique usernames.

---

## Week 3 Entities

### `term`

Groups exam periods within an academic year. Chad uses "Trimestre 1, 2, 3" system.

| Column             | Type                  | Constraints                        | Notes                        |
| ------------------ | --------------------- | ---------------------------------- | ---------------------------- |
| `id`               | TEXT / text           | PRIMARY KEY                        | UUID                         |
| `school_id`        | TEXT / text           | FK → `school.id` ON CASCADE        | Non-null                     |
| `academic_year_id` | TEXT / text           | FK → `academic_year.id` ON CASCADE | Non-null                     |
| `label`            | TEXT / text           | NOT NULL                           | e.g., "Trimestre 1" (French) |
| `start_date`       | TEXT / text           | —                                  | ISO date: YYYY-MM-DD         |
| `end_date`         | TEXT / text           | —                                  | ISO date: YYYY-MM-DD         |
| `is_current`       | INTEGER / boolean     | DEFAULT false                      | Only one active per year     |
| `created_at`       | INTEGER / timestamptz | NOT NULL                           | Set on insert                |

**Unique constraint**: `(academic_year_id, label)` — no duplicate term names in same year.

**Indexes:**

- ✅ `term_academic_year_id_label_unique` (UNIQUE) — ensures one "Trimestre 1" per academic year
- ✅ `term_academic_year_id_idx` (PG only) — query by academic year
- ✅ `term_is_current_idx` (PG only) — quick lookup of active term

---

### `class_level`

Represents class grades in Chad's education system (CP, CE1, CE2, CM1, CM2, 6ème–Terminale).

| Column       | Type                  | Constraints                 | Notes                                       |
| ------------ | --------------------- | --------------------------- | ------------------------------------------- |
| `id`         | TEXT / text           | PRIMARY KEY                 | UUID                                        |
| `school_id`  | TEXT / text           | FK → `school.id` ON CASCADE | Non-null                                    |
| `name`       | TEXT / text           | NOT NULL                    | e.g., "Terminale", "6ème"                   |
| `short_name` | TEXT / text           | —                           | e.g., "Tle", "6"                            |
| `order`      | INTEGER / integer     | —                           | For sorting (1=CP, 2=CE1, ... 12=Terminale) |
| `created_at` | INTEGER / timestamptz | NOT NULL                    | Set on insert                               |

**Unique constraint**: `(school_id, name)` — no duplicate class names per school.

**Indexes:**

- ✅ `class_level_school_id_name_unique` (UNIQUE) — ensures naming uniqueness
- ✅ `class_level_order_idx` (PG only) — sort by grade order

**Data example:**

```json
[
  {
    "id": "...",
    "school_id": "...",
    "name": "Cours Préparatoire",
    "short_name": "CP",
    "order": 1
  },
  {
    "id": "...",
    "school_id": "...",
    "name": "Cours Élémentaire 1",
    "short_name": "CE1",
    "order": 2
  },
  {
    "id": "...",
    "school_id": "...",
    "name": "Terminale",
    "short_name": "Tle",
    "order": 12
  }
]
```

---

### `subject`

Curriculum subjects taught at the school (Mathématiques, Français, Sciences, etc.).

| Column        | Type                  | Constraints                 | Notes                                            |
| ------------- | --------------------- | --------------------------- | ------------------------------------------------ |
| `id`          | TEXT / text           | PRIMARY KEY                 | UUID                                             |
| `school_id`   | TEXT / text           | FK → `school.id` ON CASCADE | Non-null                                         |
| `name`        | TEXT / text           | NOT NULL                    | e.g., "Mathématiques" (French)                   |
| `code`        | TEXT / text           | —                           | e.g., "MATH", "FR" (optional, unique per school) |
| `description` | TEXT / text           | —                           | Teaching context/notes                           |
| `created_at`  | INTEGER / timestamptz | NOT NULL                    | Set on insert                                    |

**Unique constraint**: `(school_id, code)` where `code IS NOT NULL` — each school's subject codes are unique.

**Indexes:**

- ✅ `subject_school_id_code_unique` (UNIQUE) — ensures code uniqueness

**Data example (French):**

```json
[
  { "id": "...", "school_id": "...", "name": "Mathématiques", "code": "MATH" },
  { "id": "...", "school_id": "...", "name": "Français", "code": "FR" },
  { "id": "...", "school_id": "...", "name": "Sciences Naturelles", "code": "SVT" },
  {
    "id": "...",
    "school_id": "...",
    "name": "Éducation Physique et Sportive",
    "code": "EPS"
  }
]
```

---

## Indexes & Performance

### Why Indexes Matter

- **Foreign key lookups**: Queries like "find all terms in academic year X" are instant with an index on `academic_year_id`.
- **Uniqueness constraints**: `UNIQUE` indexes prevent duplicate data and serve as constraints.
- **Sorting & filtering**: Order-by queries on `class_level.order` are milliseconds faster with an index.

### All Indexes (Phase 1.1)

| Table         | Index Name                           | Columns                     | Type         | Purpose                               |
| ------------- | ------------------------------------ | --------------------------- | ------------ | ------------------------------------- |
| `term`        | `term_academic_year_id_label_unique` | `(academic_year_id, label)` | UNIQUE       | No duplicate term names per year      |
| `term`        | `term_academic_year_id_idx`          | `(academic_year_id)`        | Regular (PG) | Fast lookup by academic year          |
| `term`        | `term_is_current_idx`                | `(is_current)`              | Regular (PG) | Find current term quickly             |
| `class_level` | `class_level_school_id_name_unique`  | `(school_id, name)`         | UNIQUE       | No duplicate class names per school   |
| `class_level` | `class_level_order_idx`              | `(order)`                   | Regular (PG) | Sort classes by grade order           |
| `subject`     | `subject_school_id_code_unique`      | `(school_id, code)`         | UNIQUE       | No duplicate subject codes per school |

### SQLite Note

SQLite (local database) does **not** generate non-unique indexes by default — Drizzle only creates UNIQUE indexes for SQLite. PostgreSQL gets both UNIQUE and regular indexes for better query optimization. This is acceptable because:

- Local queries are fast even without indexes (SQLite is embedded)
- Cloud queries benefit most from indexing (PostgreSQL)
- Migrations are kept in sync via Drizzle's entity definitions

---

## Constraints & Data Integrity

### Foreign Key Constraints

All foreign keys use `ON DELETE CASCADE` — when a school is deleted, all its academic years, terms, classes, and subjects are deleted automatically.

| Relationship                                 | Constraint        |
| -------------------------------------------- | ----------------- |
| `academic_year.school_id` → `school.id`      | ON DELETE CASCADE |
| `term.school_id` → `school.id`               | ON DELETE CASCADE |
| `term.academic_year_id` → `academic_year.id` | ON DELETE CASCADE |
| `user.school_id` → `school.id`               | ON DELETE CASCADE |
| `class_level.school_id` → `school.id`        | ON DELETE CASCADE |
| `subject.school_id` → `school.id`            | ON DELETE CASCADE |

### NOT NULL Constraints

All critical fields require values at insertion time:

| Table           | Columns                                                                     |
| --------------- | --------------------------------------------------------------------------- |
| `school`        | `name`, `created_at`                                                        |
| `academic_year` | `school_id`, `label`, `is_current`, `created_at`                            |
| `user`          | `school_id`, `username`, `password_hash`, `role`, `is_active`, `created_at` |
| `term`          | `school_id`, `academic_year_id`, `label`, `is_current`, `created_at`        |
| `class_level`   | `school_id`, `name`, `created_at`                                           |
| `subject`       | `school_id`, `name`, `created_at`                                           |

### UNIQUE Constraints

Prevent duplicate business data:

| Table         | Columns                     | Scope             | Rationale                                 |
| ------------- | --------------------------- | ----------------- | ----------------------------------------- |
| `user`        | `(school_id, username)`     | Per school        | Each school needs unique logins           |
| `term`        | `(academic_year_id, label)` | Per academic year | Can't have two "Trimestre 1" in same year |
| `class_level` | `(school_id, name)`         | Per school        | Can't have duplicate class names          |
| `subject`     | `(school_id, code)`         | Per school        | Can't have duplicate subject codes        |

---

## Migrations

### File Organization

```
packages/db/
├── drizzle/
│   ├── sqlite/
│   │   ├── 0000_foamy_mephistopheles.sql    (Phase 0: school, academic_year, user)
│   │   ├── 0001_majestic_captain_midlands.sql (Phase 0: term, class_level, subject)
│   │   ├── 0002_zippy_roxanne_simpson.sql    (Phase 1.1 Week 3: indexes & constraints)
│   │   └── meta/
│   │       ├── _journal.json
│   │       └── 0000_snapshot.json
│   └── pg/
│       ├── 0000_foamy_mephistopheles.sql    (Phase 0: school, academic_year, user)
│       ├── 0001_cuddly_nighthawk.sql         (Phase 0: term, class_level, subject)
│       ├── 0002_productive_shocker.sql       (Phase 1.1 Week 3: indexes & constraints)
│       └── meta/
│           ├── _journal.json
│           └── 0000_snapshot.json
└── src/
    └── schema/
        └── entities/
            ├── school.ts
            ├── academic-year.ts
            ├── user.ts
            ├── term.ts
            ├── class-level.ts
            ├── subject.ts
            └── index.ts
```

### How to Apply Migrations

**SQLite (local):**

```bash
cd packages/db
pnpm db:migrate
```

**PostgreSQL (cloud):**

```bash
cd packages/db
DATABASE_URL=postgresql://user:pass@host/db pnpm db:migrate:pg
```

### How to Generate Migrations

After modifying entity files (`src/schema/entities/*.ts`), regenerate migrations:

```bash
pnpm db:generate
```

This creates `.sql` files in both `drizzle/sqlite/` and `drizzle/pg/` directories.

---

## Entity-Based Architecture

### Why Entity Files?

**Before (Dual files - DRY violation):**

```
src/schema/
├── sqlite.ts    (duplicate definitions)
└── pg.ts        (duplicate definitions)
```

Each table was defined twice, causing sync errors and maintenance burden.

**Now (Single source of truth):**

```
src/schema/entities/
├── term.ts       (both SQLite + PG + interface)
├── class-level.ts (both SQLite + PG + interface)
├── subject.ts    (both SQLite + PG + interface)
└── index.ts      (barrel export)
```

### Entity File Template

```typescript
import { ... } from "drizzle-orm/pg-core";
import { ... } from "drizzle-orm/sqlite-core";

// Shared TypeScript interface for all layers (API, frontend, etc.)
export interface Term {
  id: string;
  school_id: string;
  academic_year_id: string;
  label: string;
  // ... all fields
}

// SQLite (offline-first local database)
export const termSqlite = sqliteTable("term", {
  // ... columns with SQLite types
}, (table) => ({
  // ... indexes and constraints
}));

// PostgreSQL (cloud database, identical structure)
export const termPg = pgTable("term", {
  // ... columns with PG types
}, (table) => ({
  // ... indexes and constraints
}));
```

### Benefits

✅ **DRY**: Change once, synced to both databases  
✅ **Type Safety**: Single TypeScript interface used everywhere  
✅ **Consistency**: Schema always in sync (compiler enforces it)  
✅ **Maintainability**: One file per entity, clear ownership

---

## Current Seed Data (May 4, 2026)

**School:** Lycée Félix Éboué de N'Djamena  
**Academic Year:** 2025–2026  
**Terms:** Trimestre 1, Trimestre 2, Trimestre 3  
**Class Levels:** CP → Terminale (12 levels, French names)  
**Subjects:** 10 subjects (all French names: Mathématiques, Français, etc.)  
**Users:** 1 school master (admin), 5 teachers, 30 students (with parents)

Seed data is created/updated via:

```bash
pnpm db:seed              # SQLite
pnpm db:seed:pg           # PostgreSQL
```

Both scripts are **idempotent** — safe to run multiple times.

---

## Next Phase: Week 4 People Entities

(Placeholder for future documentation)

- `student` — student profiles with enrollment status
- `parent` / `student_parent` — family relationships
- `teacher` — teacher profiles with salary tracking
- `family_member` — teacher dependents
- `salary` — payroll records

### SQLite migration order

`drizzle-kit generate` may emit `CREATE TABLE` statements in an order that breaks inline foreign keys on SQLite. The committed `0000_*.sql` for SQLite is **manually ordered** (`school` → `academic_year` → `user`). After regenerating, verify FK order before committing.

## Seed data

- **SQLite:** `pnpm db:seed` (after `pnpm db:migrate`)
- **PostgreSQL:** `pnpm db:seed:pg` (after `pnpm db:migrate:pg`)

Creates a demo school **Lycée Félix Éboué de N'Djamena**, one academic year **2025–2026**, and user **`directeur.demo`** (password **`ChangeMoi2026!`** — change immediately outside local dev).

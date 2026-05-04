import { pgTable, text as pgText, timestamp, unique } from "drizzle-orm/pg-core";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { schoolPg, schoolSqlite } from "./school";

// ============================================================================
// Shared Interface
// ============================================================================

export interface Subject {
  id: string;
  school_id: string;
  name: string;
  code?: string | null;
  description?: string | null;
  created_at: string | number | Date;
}

// ============================================================================
// SQLite Implementation
// ============================================================================

export const subjectSqlite = sqliteTable(
  "subject",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    school_id: text("school_id")
      .notNull()
      .references(() => schoolSqlite.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    code: text("code"),
    description: text("description"),
    created_at: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    // Unique constraint: subject code must be unique per school (where code is not null)
    codeUniqueIdx: uniqueIndex("subject_school_id_code_unique").on(
      table.school_id,
      table.code,
    ),
  }),
);

// ============================================================================
// PostgreSQL Implementation
// ============================================================================

export const subjectPg = pgTable(
  "subject",
  {
    id: pgText("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    school_id: pgText("school_id")
      .notNull()
      .references(() => schoolPg.id, { onDelete: "cascade" }),
    name: pgText("name").notNull(),
    code: pgText("code"),
    description: pgText("description"),
    created_at: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    // Unique constraint: subject code must be unique per school (where code is not null)
    codeUniqueIdx: unique("subject_school_id_code_unique").on(
      table.school_id,
      table.code,
    ),
  }),
);

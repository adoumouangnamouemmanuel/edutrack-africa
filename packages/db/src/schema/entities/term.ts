import {
  boolean,
  index,
  pgTable,
  text as pgText,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { academicYearPg, academicYearSqlite } from "./academic-year";
import { schoolPg, schoolSqlite } from "./school";

// ============================================================================
// Shared Interface
// ============================================================================

export interface Term {
  id: string;
  school_id: string;
  academic_year_id: string;
  label: string;
  start_date?: string | null;
  end_date?: string | null;
  is_current: boolean;
  created_at: string | number | Date;
}

// ============================================================================
// SQLite Implementation
// ============================================================================

export const termSqlite = sqliteTable(
  "term",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    school_id: text("school_id")
      .notNull()
      .references(() => schoolSqlite.id, { onDelete: "cascade" }),
    academic_year_id: text("academic_year_id")
      .notNull()
      .references(() => academicYearSqlite.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    start_date: text("start_date"),
    end_date: text("end_date"),
    is_current: integer("is_current", { mode: "boolean" }).notNull().default(false),
    created_at: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    // Unique constraint: ensure term label is unique per academic year
    labelUniqueIdx: uniqueIndex("term_academic_year_id_label_unique").on(
      table.academic_year_id,
      table.label,
    ),
  }),
);

// ============================================================================
// PostgreSQL Implementation
// ============================================================================

export const termPg = pgTable(
  "term",
  {
    id: pgText("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    school_id: pgText("school_id")
      .notNull()
      .references(() => schoolPg.id, { onDelete: "cascade" }),
    academic_year_id: pgText("academic_year_id")
      .notNull()
      .references(() => academicYearPg.id, { onDelete: "cascade" }),
    label: pgText("label").notNull(),
    start_date: pgText("start_date"),
    end_date: pgText("end_date"),
    is_current: boolean("is_current").notNull().default(false),
    created_at: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    // Unique constraint: ensure term label is unique per academic year
    labelUniqueIdx: unique("term_academic_year_id_label_unique").on(
      table.academic_year_id,
      table.label,
    ),
    // Indexes for query performance
    academicYearIdIdx: index("term_academic_year_id_idx").on(table.academic_year_id),
    isCurrentIdx: index("term_is_current_idx").on(table.is_current),
  }),
);

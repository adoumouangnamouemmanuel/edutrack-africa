import { boolean, pgTable, text as pgText } from "drizzle-orm/pg-core";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { schoolPg, schoolSqlite } from "./school";

// ============================================================================
// Shared Interface
// ============================================================================

export interface AcademicYear {
  id: string;
  school_id: string;
  label: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  grading_system: string;
}

// ============================================================================
// SQLite Implementation
// ============================================================================

export const academicYearSqlite = sqliteTable("academic_year", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  school_id: text("school_id")
    .notNull()
    .references(() => schoolSqlite.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  start_date: text("start_date").notNull(),
  end_date: text("end_date").notNull(),
  is_current: integer("is_current", { mode: "boolean" }).notNull().default(false),
  grading_system: text("grading_system").notNull().default("trimesters"),
});

// ============================================================================
// PostgreSQL Implementation
// ============================================================================

export const academicYearPg = pgTable("academic_year", {
  id: pgText("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  school_id: pgText("school_id")
    .notNull()
    .references(() => schoolPg.id, { onDelete: "cascade" }),
  label: pgText("label").notNull(),
  start_date: pgText("start_date").notNull(),
  end_date: pgText("end_date").notNull(),
  is_current: boolean("is_current").notNull().default(false),
  grading_system: pgText("grading_system").notNull().default("trimesters"),
});

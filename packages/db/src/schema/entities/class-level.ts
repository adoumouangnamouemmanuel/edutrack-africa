import { integer, pgTable, text as pgText, timestamp } from "drizzle-orm/pg-core";
import {
  integer as sqliteInteger,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { schoolPg, schoolSqlite } from "./school";

// ============================================================================
// Shared Interface
// ============================================================================

export interface ClassLevel {
  id: string;
  school_id: string;
  name: string;
  short_name?: string | null;
  order?: number | string | null;
  created_at: string | number | Date;
}

// ============================================================================
// SQLite Implementation
// ============================================================================

export const classLevelSqlite = sqliteTable(
  "class_level",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    school_id: text("school_id")
      .notNull()
      .references(() => schoolSqlite.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    short_name: text("short_name"),
    order: sqliteInteger("order"),
    created_at: sqliteInteger("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    // Unique constraint: ensure class level name is unique per school
    nameUniqueIdx: uniqueIndex("class_level_school_id_name_unique").on(
      table.school_id,
      table.name,
    ),
  }),
);

// ============================================================================
// PostgreSQL Implementation
// ============================================================================

export const classLevelPg = pgTable("class_level", {
  id: pgText("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  school_id: pgText("school_id")
    .notNull()
    .references(() => schoolPg.id, { onDelete: "cascade" }),
  name: pgText("name").notNull(),
  short_name: pgText("short_name"),
  order: integer("order"),
  created_at: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

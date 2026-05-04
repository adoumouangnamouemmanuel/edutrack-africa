import { pgTable, text as pgText, timestamp } from "drizzle-orm/pg-core";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// ============================================================================
// Shared Interface
// ============================================================================

export interface School {
  id: string;
  name: string;
  short_name?: string | null;
  logo_url?: string | null;
  address?: string | null;
  city?: string | null;
  country: string;
  phone?: string | null;
  email?: string | null;
  motto?: string | null;
  ministry_code?: string | null;
  school_type: string;
  default_language: string;
  created_at: string | number | Date;
}

// ============================================================================
// SQLite Implementation
// ============================================================================

export const schoolSqlite = sqliteTable("school", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  short_name: text("short_name"),
  logo_url: text("logo_url"),
  address: text("address"),
  city: text("city"),
  country: text("country").notNull().default("TD"),
  phone: text("phone"),
  email: text("email"),
  motto: text("motto"),
  ministry_code: text("ministry_code"),
  school_type: text("school_type").notNull().default("public"),
  default_language: text("default_language").notNull().default("fr"),
  created_at: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ============================================================================
// PostgreSQL Implementation
// ============================================================================

export const schoolPg = pgTable("school", {
  id: pgText("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: pgText("name").notNull(),
  short_name: pgText("short_name"),
  logo_url: pgText("logo_url"),
  address: pgText("address"),
  city: pgText("city"),
  country: pgText("country").notNull().default("TD"),
  phone: pgText("phone"),
  email: pgText("email"),
  motto: pgText("motto"),
  ministry_code: pgText("ministry_code"),
  school_type: pgText("school_type").notNull().default("public"),
  default_language: pgText("default_language").notNull().default("fr"),
  created_at: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

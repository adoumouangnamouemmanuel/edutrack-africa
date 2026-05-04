import {
  boolean,
  pgTable,
  text as pgText,
  uniqueIndex as pgUniqueIndex,
  timestamp,
} from "drizzle-orm/pg-core";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { schoolPg, schoolSqlite } from "./school";

// ============================================================================
// Shared Interface
// ============================================================================

export interface User {
  id: string;
  school_id: string;
  username: string;
  password_hash: string;
  role: string;
  is_active: boolean;
  last_login?: string | number | Date | null;
  created_at: string | number | Date;
  digital_signature_cert?: string | null;
}

// ============================================================================
// SQLite Implementation
// ============================================================================

export const userSqlite = sqliteTable(
  "user",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    school_id: text("school_id")
      .notNull()
      .references(() => schoolSqlite.id, { onDelete: "cascade" }),
    username: text("username").notNull(),
    password_hash: text("password_hash").notNull(),
    role: text("role").notNull(),
    is_active: integer("is_active", { mode: "boolean" }).notNull().default(true),
    last_login: integer("last_login", { mode: "timestamp_ms" }),
    created_at: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    digital_signature_cert: text("digital_signature_cert"),
  },
  (table) => ({
    schoolUsernameUnique: uniqueIndex("user_school_id_username_unique").on(
      table.school_id,
      table.username,
    ),
  }),
);

// ============================================================================
// PostgreSQL Implementation
// ============================================================================

export const userPg = pgTable(
  "user",
  {
    id: pgText("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    school_id: pgText("school_id")
      .notNull()
      .references(() => schoolPg.id, { onDelete: "cascade" }),
    username: pgText("username").notNull(),
    password_hash: pgText("password_hash").notNull(),
    role: pgText("role").notNull(),
    is_active: boolean("is_active").notNull().default(true),
    last_login: timestamp("last_login", { withTimezone: true, mode: "date" }),
    created_at: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    digital_signature_cert: pgText("digital_signature_cert"),
  },
  (table) => ({
    schoolUsernameUnique: pgUniqueIndex("user_school_id_username_unique").on(
      table.school_id,
      table.username,
    ),
  }),
);

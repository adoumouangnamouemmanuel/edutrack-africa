import {
  boolean,
  index as pgIndex,
  pgTable,
  text as pgText,
  timestamp,
} from "drizzle-orm/pg-core";
import {
  integer,
  index as sqliteIndex,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { studentPg, studentSqlite } from "./student";

// ============================================================================
// Shared Interface
// ============================================================================

export interface Parent {
  id: string;
  student_id: string;
  relation: "father" | "mother" | "guardian" | "tutor";
  first_name: string;
  last_name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  occupation?: string | null;
  is_emergency_contact: boolean;
  created_at: string | number | Date;
}

// ============================================================================
// SQLite Implementation
// ============================================================================

export const parentSqlite = sqliteTable(
  "parent",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    student_id: text("student_id")
      .notNull()
      .references(() => studentSqlite.id, { onDelete: "cascade" }),
    relation: text("relation").notNull(),
    first_name: text("first_name").notNull(),
    last_name: text("last_name").notNull(),
    phone: text("phone"),
    email: text("email"),
    address: text("address"),
    occupation: text("occupation"),
    is_emergency_contact: integer("is_emergency_contact", { mode: "boolean" })
      .notNull()
      .default(false),
    created_at: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    studentIdIdx: sqliteIndex("parent_student_id_idx").on(table.student_id),
    studentRelationIdx: sqliteIndex("parent_student_id_relation_idx").on(
      table.student_id,
      table.relation,
    ),
  }),
);

// ============================================================================
// PostgreSQL Implementation
// ============================================================================

export const parentPg = pgTable(
  "parent",
  {
    id: pgText("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    student_id: pgText("student_id")
      .notNull()
      .references(() => studentPg.id, { onDelete: "cascade" }),
    relation: pgText("relation").notNull(),
    first_name: pgText("first_name").notNull(),
    last_name: pgText("last_name").notNull(),
    phone: pgText("phone"),
    email: pgText("email"),
    address: pgText("address"),
    occupation: pgText("occupation"),
    is_emergency_contact: boolean("is_emergency_contact").notNull().default(false),
    created_at: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    studentIdIdx: pgIndex("parent_student_id_idx").on(table.student_id),
    studentRelationIdx: pgIndex("parent_student_id_relation_idx").on(
      table.student_id,
      table.relation,
    ),
  }),
);

import {
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
import { teacherPg, teacherSqlite } from "./teacher";

// ============================================================================
// Shared Interface
// ============================================================================

export interface FamilyMember {
  id: string;
  teacher_id: string;
  relation: "spouse" | "child" | "parent";
  first_name: string;
  last_name: string;
  date_of_birth?: string | null;
  phone?: string | null;
  created_at: string | number | Date;
}

// ============================================================================
// SQLite Implementation
// ============================================================================

export const familyMemberSqlite = sqliteTable(
  "family_member",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    teacher_id: text("teacher_id")
      .notNull()
      .references(() => teacherSqlite.id, { onDelete: "cascade" }),
    relation: text("relation").notNull(),
    first_name: text("first_name").notNull(),
    last_name: text("last_name").notNull(),
    date_of_birth: text("date_of_birth"),
    phone: text("phone"),
    created_at: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    teacherIdIdx: sqliteIndex("family_member_teacher_id_idx").on(table.teacher_id),
  }),
);

// ============================================================================
// PostgreSQL Implementation
// ============================================================================

export const familyMemberPg = pgTable(
  "family_member",
  {
    id: pgText("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    teacher_id: pgText("teacher_id")
      .notNull()
      .references(() => teacherPg.id, { onDelete: "cascade" }),
    relation: pgText("relation").notNull(),
    first_name: pgText("first_name").notNull(),
    last_name: pgText("last_name").notNull(),
    date_of_birth: pgText("date_of_birth"),
    phone: pgText("phone"),
    created_at: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    teacherIdIdx: pgIndex("family_member_teacher_id_idx").on(table.teacher_id),
  }),
);

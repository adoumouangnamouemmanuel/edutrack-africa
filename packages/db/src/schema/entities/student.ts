import {
  index as pgIndex,
  pgTable,
  text as pgText,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import {
  integer,
  index as sqliteIndex,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { schoolPg, schoolSqlite } from "./school";
import { userPg, userSqlite } from "./user";

// ============================================================================
// Shared Interface
// ============================================================================

export interface Student {
  id: string;
  user_id: string;
  school_id: string;
  student_code: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: "male" | "female";
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  nationality?: string | null;
  profile_photo_url?: string | null;
  status: "active" | "graduated" | "transferred" | "drop";
  enrollment_date: string;
  created_at: string | number | Date;
  updated_at?: string | number | Date | null;
}

// ============================================================================
// SQLite Implementation
// ============================================================================

export const studentSqlite = sqliteTable(
  "student",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    user_id: text("user_id")
      .notNull()
      .references(() => userSqlite.id, { onDelete: "cascade" }),
    school_id: text("school_id")
      .notNull()
      .references(() => schoolSqlite.id, { onDelete: "cascade" }),
    student_code: text("student_code").notNull(),
    first_name: text("first_name").notNull(),
    last_name: text("last_name").notNull(),
    date_of_birth: text("date_of_birth").notNull(),
    gender: text("gender").notNull(),
    address: text("address"),
    phone: text("phone"),
    email: text("email"),
    nationality: text("nationality"),
    profile_photo_url: text("profile_photo_url"),
    status: text("status").notNull().default("active"),
    enrollment_date: text("enrollment_date").notNull(),
    created_at: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updated_at: integer("updated_at", { mode: "timestamp_ms" }),
  },
  (table) => ({
    userIdUnique: uniqueIndex("student_user_id_unique").on(table.user_id),
    schoolStudentCodeUnique: uniqueIndex("student_school_id_student_code_unique").on(
      table.school_id,
      table.student_code,
    ),
    schoolIdIdx: sqliteIndex("student_school_id_idx").on(table.school_id),
  }),
);

// ============================================================================
// PostgreSQL Implementation
// ============================================================================

export const studentPg = pgTable(
  "student",
  {
    id: pgText("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    user_id: pgText("user_id")
      .notNull()
      .references(() => userPg.id, { onDelete: "cascade" }),
    school_id: pgText("school_id")
      .notNull()
      .references(() => schoolPg.id, { onDelete: "cascade" }),
    student_code: pgText("student_code").notNull(),
    first_name: pgText("first_name").notNull(),
    last_name: pgText("last_name").notNull(),
    date_of_birth: pgText("date_of_birth").notNull(),
    gender: pgText("gender").notNull(),
    address: pgText("address"),
    phone: pgText("phone"),
    email: pgText("email"),
    nationality: pgText("nationality"),
    profile_photo_url: pgText("profile_photo_url"),
    status: pgText("status").notNull().default("active"),
    enrollment_date: pgText("enrollment_date").notNull(),
    created_at: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true, mode: "date" }),
  },
  (table) => ({
    userIdUnique: unique("student_user_id_unique").on(table.user_id),
    schoolStudentCodeUnique: unique("student_school_id_student_code_unique").on(
      table.school_id,
      table.student_code,
    ),
    schoolIdIdx: pgIndex("student_school_id_idx").on(table.school_id),
  }),
);

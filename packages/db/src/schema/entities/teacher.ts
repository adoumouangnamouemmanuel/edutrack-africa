import {
  index as pgIndex,
  integer as pgInteger,
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

export interface Teacher {
  id: string;
  user_id: string;
  school_id: string;
  employee_code: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string | null;
  gender?: "male" | "female" | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  profile_photo_url?: string | null;
  hire_date?: string | null;
  years_of_experience?: number | null;
  qualification?: string | null;
  status: "active" | "on_leave" | "terminated";
  created_at: string | number | Date;
}

// ============================================================================
// SQLite Implementation
// ============================================================================

export const teacherSqlite = sqliteTable(
  "teacher",
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
    employee_code: text("employee_code").notNull(),
    first_name: text("first_name").notNull(),
    last_name: text("last_name").notNull(),
    date_of_birth: text("date_of_birth"),
    gender: text("gender"),
    address: text("address"),
    phone: text("phone"),
    email: text("email"),
    profile_photo_url: text("profile_photo_url"),
    hire_date: text("hire_date"),
    years_of_experience: integer("years_of_experience"),
    qualification: text("qualification"),
    status: text("status").notNull().default("active"),
    created_at: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    userIdUnique: uniqueIndex("teacher_user_id_unique").on(table.user_id),
    schoolEmployeeCodeUnique: uniqueIndex("teacher_school_id_employee_code_unique").on(
      table.school_id,
      table.employee_code,
    ),
    schoolIdIdx: sqliteIndex("teacher_school_id_idx").on(table.school_id),
  }),
);

// ============================================================================
// PostgreSQL Implementation
// ============================================================================

export const teacherPg = pgTable(
  "teacher",
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
    employee_code: pgText("employee_code").notNull(),
    first_name: pgText("first_name").notNull(),
    last_name: pgText("last_name").notNull(),
    date_of_birth: pgText("date_of_birth"),
    gender: pgText("gender"),
    years_of_experience: pgInteger("years_of_experience"),
    phone: pgText("phone"),
    email: pgText("email"),
    profile_photo_url: pgText("profile_photo_url"),
    hire_date: pgText("hire_date"),
    qualification: pgText("qualification"),
    status: pgText("status").notNull().default("active"),
    created_at: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdUnique: unique("teacher_user_id_unique").on(table.user_id),
    schoolEmployeeCodeUnique: unique("teacher_school_id_employee_code_unique").on(
      table.school_id,
      table.employee_code,
    ),
    schoolIdIdx: pgIndex("teacher_school_id_idx").on(table.school_id),
  }),
);

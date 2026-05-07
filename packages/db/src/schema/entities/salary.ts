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
import { teacherPg, teacherSqlite } from "./teacher";

// ============================================================================
// Shared Interface
// ============================================================================

export interface Salary {
  id: string;
  teacher_id: string;
  amount: number;
  effective_date: string;
  payment_date?: string | null;
  payment_method?: string | null;
  status: "paid" | "pending" | "partial";
  notes?: string | null;
  created_at: string | number | Date;
}

// ============================================================================
// SQLite Implementation
// ============================================================================

export const salarySqlite = sqliteTable(
  "salary",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    teacher_id: text("teacher_id")
      .notNull()
      .references(() => teacherSqlite.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    effective_date: text("effective_date").notNull(),
    payment_date: text("payment_date"),
    payment_method: text("payment_method"),
    status: text("status").notNull().default("pending"),
    notes: text("notes"),
    created_at: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    teacherEffectiveDateUnique: uniqueIndex("salary_teacher_id_effective_date_unique").on(
      table.teacher_id,
      table.effective_date,
    ),
    teacherIdIdx: sqliteIndex("salary_teacher_id_idx").on(table.teacher_id),
    statusIdx: sqliteIndex("salary_status_idx").on(table.status),
    paymentDateIdx: sqliteIndex("salary_payment_date_idx").on(table.payment_date),
  }),
);

// ============================================================================
// PostgreSQL Implementation
// ============================================================================

export const salaryPg = pgTable(
  "salary",
  {
    id: pgText("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    teacher_id: pgText("teacher_id")
      .notNull()
      .references(() => teacherPg.id, { onDelete: "cascade" }),
    amount: pgInteger("amount").notNull(),
    effective_date: pgText("effective_date").notNull(),
    payment_date: pgText("payment_date"),
    payment_method: pgText("payment_method"),
    status: pgText("status").notNull().default("pending"),
    notes: pgText("notes"),
    created_at: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    teacherEffectiveDateUnique: unique("salary_teacher_id_effective_date_unique").on(
      table.teacher_id,
      table.effective_date,
    ),
    teacherIdIdx: pgIndex("salary_teacher_id_idx").on(table.teacher_id),
    statusIdx: pgIndex("salary_status_idx").on(table.status),
    paymentDateIdx: pgIndex("salary_payment_date_idx").on(table.payment_date),
  }),
);

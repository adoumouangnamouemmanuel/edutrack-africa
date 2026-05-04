import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

/** Core tenant: one row per school. */
export const school = sqliteTable("school", {
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
  /** e.g. public | private | religious */
  school_type: text("school_type").notNull().default("public"),
  default_language: text("default_language").notNull().default("fr"),
  created_at: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

/** Academic cycle for a school (e.g. 2025–2026). */
export const academicYear = sqliteTable("academic_year", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  school_id: text("school_id")
    .notNull()
    .references(() => school.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  start_date: text("start_date").notNull(),
  end_date: text("end_date").notNull(),
  is_current: integer("is_current", { mode: "boolean" }).notNull().default(false),
  /** trimesters | semesters */
  grading_system: text("grading_system").notNull().default("trimesters"),
});

/**
 * Login identity scoped to a school. Table name `user` matches UML; quoted in PostgreSQL.
 */
export const user = sqliteTable(
  "user",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    school_id: text("school_id")
      .notNull()
      .references(() => school.id, { onDelete: "cascade" }),
    username: text("username").notNull(),
    password_hash: text("password_hash").notNull(),
    /** school_master | teacher | student */
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

export const sqliteSchema = { school, academicYear, user };

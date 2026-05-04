import { boolean, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

/** PostgreSQL mirror of `sqlite.ts` — keep columns aligned manually until a codegen step exists. */
export const school = pgTable("school", {
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
  created_at: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

export const academicYear = pgTable("academic_year", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  school_id: text("school_id")
    .notNull()
    .references(() => school.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  start_date: text("start_date").notNull(),
  end_date: text("end_date").notNull(),
  is_current: boolean("is_current").notNull().default(false),
  grading_system: text("grading_system").notNull().default("trimesters"),
});

export const user = pgTable(
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
    role: text("role").notNull(),
    is_active: boolean("is_active").notNull().default(true),
    last_login: timestamp("last_login", { withTimezone: true, mode: "date" }),
    created_at: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    digital_signature_cert: text("digital_signature_cert"),
  },
  (table) => ({
    schoolUsernameUnique: uniqueIndex("user_school_id_username_unique").on(
      table.school_id,
      table.username,
    ),
  }),
);

export const pgSchema = { school, academicYear, user };

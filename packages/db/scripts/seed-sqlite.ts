import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import * as schema from "../src/schema/sqlite";
import { ensureSqliteDirectory, resolveSqliteFilePath } from "./resolve-sqlite-path";

const filePath = resolveSqliteFilePath();
ensureSqliteDirectory(filePath);

const raw = new Database(filePath);
const db = drizzle(raw, { schema });

const existing = db.select().from(schema.school).limit(1).all();
if (existing.length > 0) {
  // eslint-disable-next-line no-console
  console.log("[db] Seed skipped (school already exists).");
  raw.close();
  process.exit(0);
}

const passwordHash = bcrypt.hashSync("ChangeMoi2026!", 12);

const [schoolRow] = db
  .insert(schema.school)
  .values({
    name: "Lycée Félix Éboué de N'Djamena",
    short_name: "LFEN",
    city: "N'Djamena",
    country: "TD",
    school_type: "public",
    motto: "Excellence et discipline",
  })
  .returning()
  .all();

const schoolId = schoolRow?.id;
if (!schoolId) {
  raw.close();
  throw new Error("[db] Seed failed: school insert returned no row.");
}

db.insert(schema.academicYear)
  .values({
    school_id: schoolId,
    label: "2025–2026",
    start_date: "2025-09-01",
    end_date: "2026-06-30",
    is_current: true,
    grading_system: "trimesters",
  })
  .run();

db.insert(schema.user)
  .values({
    school_id: schoolId,
    username: "directeur.demo",
    password_hash: passwordHash,
    role: "school_master",
    is_active: true,
  })
  .run();

// eslint-disable-next-line no-console
console.log(`[db] Seed complete (SQLite) → school id ${schoolId}`);
raw.close();

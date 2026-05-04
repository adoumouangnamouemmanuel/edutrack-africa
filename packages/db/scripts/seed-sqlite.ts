import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";

import { sqliteSchema } from "../src/schema";
import { ensureSqliteDirectory, resolveSqliteFilePath } from "./resolve-sqlite-path";

const filePath = resolveSqliteFilePath();
ensureSqliteDirectory(filePath);

const raw = new Database(filePath);
const db = drizzle(raw, { schema: sqliteSchema });

const existing = db.select().from(sqliteSchema.school).limit(1).all();
if (existing.length > 0) {
  // eslint-disable-next-line no-console
  console.log("[db] Seed skipped (school already exists).");
  raw.close();
  process.exit(0);
}

const passwordHash = bcrypt.hashSync("ChangeMoi2026!", 12);

const [schoolRow] = db
  .insert(sqliteSchema.school)
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

db.insert(sqliteSchema.academicYear)
  .values({
    school_id: schoolId,
    label: "2025–2026",
    start_date: "2025-09-01",
    end_date: "2026-06-30",
    is_current: true,
    grading_system: "trimesters",
  })
  .run();

db.insert(sqliteSchema.user)
  .values({
    school_id: schoolId,
    username: "directeur.demo",
    password_hash: passwordHash,
    role: "school_master",
    is_active: true,
  })
  .run();

// ===========================
// Week 3 Core Entities Seeds
// ===========================

// Get the academic year ID
const academicYears = db
  .select()
  .from(sqliteSchema.academicYear)
  .where(eq(sqliteSchema.academicYear.school_id, schoolId))
  .all();

const academicYearId = academicYears[0]?.id;
if (!academicYearId) {
  raw.close();
  throw new Error("[db] Seed failed: academic year not found.");
}

// Seed Terms
db.insert(sqliteSchema.term)
  .values([
    {
      school_id: schoolId,
      academic_year_id: academicYearId,
      label: "Term 1",
      start_date: "2025-09-01",
      end_date: "2025-11-30",
      is_current: true,
    },
    {
      school_id: schoolId,
      academic_year_id: academicYearId,
      label: "Term 2",
      start_date: "2025-12-01",
      end_date: "2026-02-28",
      is_current: false,
    },
    {
      school_id: schoolId,
      academic_year_id: academicYearId,
      label: "Term 3",
      start_date: "2026-03-01",
      end_date: "2026-06-30",
      is_current: false,
    },
  ])
  .run();

// Seed Class Levels
db.insert(sqliteSchema.classLevel)
  .values([
    { school_id: schoolId, name: "Grade 1", short_name: "G1", order: 1 },
    { school_id: schoolId, name: "Grade 2", short_name: "G2", order: 2 },
    { school_id: schoolId, name: "Grade 3", short_name: "G3", order: 3 },
    { school_id: schoolId, name: "Form 1", short_name: "F1", order: 4 },
    { school_id: schoolId, name: "Form 2", short_name: "F2", order: 5 },
    { school_id: schoolId, name: "Form 3", short_name: "F3", order: 6 },
  ])
  .run();

// Seed Subjects
db.insert(sqliteSchema.subject)
  .values([
    {
      school_id: schoolId,
      name: "Mathematics",
      code: "MATH",
      description: "Core mathematics curriculum",
    },
    {
      school_id: schoolId,
      name: "French",
      code: "FR",
      description: "French language and literature",
    },
    {
      school_id: schoolId,
      name: "English",
      code: "EN",
      description: "English language and literature",
    },
    {
      school_id: schoolId,
      name: "Physics",
      code: "PHY",
      description: "Physics and natural sciences",
    },
    {
      school_id: schoolId,
      name: "Chemistry",
      code: "CHEM",
      description: "Chemistry and laboratory work",
    },
    {
      school_id: schoolId,
      name: "History",
      code: "HIST",
      description: "World and national history",
    },
    {
      school_id: schoolId,
      name: "Geography",
      code: "GEO",
      description: "Geography and environmental studies",
    },
    {
      school_id: schoolId,
      name: "Physical Education",
      code: "PE",
      description: "Sports and physical education",
    },
  ])
  .run();

// eslint-disable-next-line no-console
console.log(`[db] Seed complete (SQLite) → Week 3 data seeded for school id ${schoolId}`);
raw.close();

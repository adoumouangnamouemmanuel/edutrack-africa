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

let schoolId: string;

// If school doesn't exist, create initial data
if (existing.length === 0) {
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

  if (!schoolRow?.id) {
    raw.close();
    throw new Error("[db] Seed failed: school insert returned no row.");
  }

  schoolId = schoolRow.id;

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

  // eslint-disable-next-line no-console
  console.log("[db] Initial data seeded (SQLite)");
} else {
  schoolId = existing[0]!.id;
}

// Check if Week 3 data already seeded
const termsExist = db
  .select()
  .from(sqliteSchema.term)
  .where(eq(sqliteSchema.term.school_id, schoolId))
  .limit(1)
  .all();

if (termsExist.length > 0) {
  // eslint-disable-next-line no-console
  console.log("[db] Seed skipped (Week 3 data already seeded).");
  raw.close();
  process.exit(0);
}

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
      label: "Trimestre 1",
      start_date: "2025-09-01",
      end_date: "2025-11-30",
      is_current: true,
    },
    {
      school_id: schoolId,
      academic_year_id: academicYearId,
      label: "Trimestre 2",
      start_date: "2025-12-01",
      end_date: "2026-02-28",
      is_current: false,
    },
    {
      school_id: schoolId,
      academic_year_id: academicYearId,
      label: "Trimestre 3",
      start_date: "2026-03-01",
      end_date: "2026-06-30",
      is_current: false,
    },
  ])
  .run();

// Seed Class Levels (Chad Education System)
db.insert(sqliteSchema.classLevel)
  .values([
    { school_id: schoolId, name: "Cours Préparatoire", short_name: "CP", order: 1 },
    { school_id: schoolId, name: "Cours Élémentaire 1", short_name: "CE1", order: 2 },
    { school_id: schoolId, name: "Cours Élémentaire 2", short_name: "CE2", order: 3 },
    { school_id: schoolId, name: "Cours Moyen 1", short_name: "CM1", order: 4 },
    { school_id: schoolId, name: "Cours Moyen 2", short_name: "CM2", order: 5 },
    { school_id: schoolId, name: "Sixième", short_name: "6ème", order: 6 },
    { school_id: schoolId, name: "Cinquième", short_name: "5ème", order: 7 },
    { school_id: schoolId, name: "Quatrième", short_name: "4ème", order: 8 },
    { school_id: schoolId, name: "Troisième", short_name: "3ème", order: 9 },
    { school_id: schoolId, name: "Seconde", short_name: "2nde", order: 10 },
    { school_id: schoolId, name: "Première", short_name: "1ère", order: 11 },
    { school_id: schoolId, name: "Terminale", short_name: "Tle", order: 12 },
  ])
  .run();

// Seed Subjects
db.insert(sqliteSchema.subject)
  .values([
    {
      school_id: schoolId,
      name: "Mathématiques",
      code: "MATH",
      description: "Enseignement des mathématiques",
    },
    {
      school_id: schoolId,
      name: "Français",
      code: "FR",
      description: "Langue et littérature française",
    },
    {
      school_id: schoolId,
      name: "Anglais",
      code: "EN",
      description: "Langue et littérature anglaise",
    },
    {
      school_id: schoolId,
      name: "Physique-Chimie",
      code: "PC",
      description: "Physique et chimie",
    },
    {
      school_id: schoolId,
      name: "Sciences de la Vie et de la Terre",
      code: "SVT",
      description: "Biologie et sciences de la vie",
    },
    {
      school_id: schoolId,
      name: "Histoire",
      code: "HIST",
      description: "Histoire du monde et du Tchad",
    },
    {
      school_id: schoolId,
      name: "Géographie",
      code: "GEO",
      description: "Géographie et environnement",
    },
    {
      school_id: schoolId,
      name: "Éducation Physique et Sportive",
      code: "EPS",
      description: "Sports et activités physiques",
    },
    {
      school_id: schoolId,
      name: "Philosophie",
      code: "PHILO",
      description: "Initiation à la philosophie",
    },
    {
      school_id: schoolId,
      name: "Informatique",
      code: "INFO",
      description: "Technologie et informatique",
    },
  ])
  .run();

// eslint-disable-next-line no-console
console.log(`[db] Seed complete (SQLite) → Week 3 data seeded for school id ${schoolId}`);
raw.close();

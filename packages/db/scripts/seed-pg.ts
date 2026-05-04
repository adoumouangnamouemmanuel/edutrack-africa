import bcrypt from "bcryptjs";
import "dotenv/config";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

import { pgSchema } from "../src/schema";

// Ensure repo-root .env is loaded when script runs from packages/db
const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// dotenv/config provides basic loading, but ensure correct path in case cwd != repo root
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(pkgRoot, "..", "..", ".env") });

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("[db] DATABASE_URL is required for PostgreSQL seed.");
  }

  const pool = new pg.Pool({ connectionString });
  const db = drizzle(pool, { schema: pgSchema });

  try {
    const existing = await db.select().from(pgSchema.school).limit(1);
    if (existing.length > 0) {
      // eslint-disable-next-line no-console
      console.log("[db] Seed skipped (school already exists).");
      return;
    }

    const passwordHash = bcrypt.hashSync("ChangeMoi2026!", 12);

    const [schoolRow] = await db
      .insert(pgSchema.school)
      .values({
        name: "Lycée Félix Éboué de N'Djamena",
        short_name: "LFEN",
        city: "N'Djamena",
        country: "TD",
        school_type: "public",
        motto: "Excellence et discipline",
      })
      .returning();

    const schoolId = schoolRow?.id;
    if (!schoolId) {
      throw new Error("[db] Seed failed: school insert returned no row.");
    }

    await db.insert(pgSchema.academicYear).values({
      school_id: schoolId,
      label: "2025–2026",
      start_date: "2025-09-01",
      end_date: "2026-06-30",
      is_current: true,
      grading_system: "trimesters",
    });

    await db.insert(pgSchema.user).values({
      school_id: schoolId,
      username: "directeur.demo",
      password_hash: passwordHash,
      role: "school_master",
      is_active: true,
    });

    // ===========================
    // Week 3 Core Entities Seeds
    // ===========================

    // Get the academic year ID
    const academicYears = await db
      .select()
      .from(pgSchema.academicYear)
      .where(eq(pgSchema.academicYear.school_id, schoolId));

    const academicYearId = academicYears[0]?.id;
    if (!academicYearId) {
      throw new Error("[db] Seed failed: academic year not found.");
    }

    // Seed Terms
    await db.insert(pgSchema.term).values([
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
    ]);

    // Seed Class Levels
    await db.insert(pgSchema.classLevel).values([
      { school_id: schoolId, name: "Grade 1", short_name: "G1", order: 1 },
      { school_id: schoolId, name: "Grade 2", short_name: "G2", order: 2 },
      { school_id: schoolId, name: "Grade 3", short_name: "G3", order: 3 },
      { school_id: schoolId, name: "Form 1", short_name: "F1", order: 4 },
      { school_id: schoolId, name: "Form 2", short_name: "F2", order: 5 },
      { school_id: schoolId, name: "Form 3", short_name: "F3", order: 6 },
    ]);

    // Seed Subjects
    await db.insert(pgSchema.subject).values([
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
    ]);

    // eslint-disable-next-line no-console
    console.log(
      `[db] Seed complete (PostgreSQL) → Week 3 data seeded for school id ${schoolId}`,
    );
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

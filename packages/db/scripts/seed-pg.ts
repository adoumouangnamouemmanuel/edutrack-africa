import bcryptjs from "bcryptjs";
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
    let schoolId: string;
    const existing = await db.select().from(pgSchema.school).limit(1);

    // If school doesn't exist, create initial data
    if (existing.length === 0) {
      const passwordHash = bcryptjs.hashSync("ChangeMoi2026!", 12);

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

      if (!schoolRow?.id) {
        throw new Error("[db] Seed failed: school insert returned no row.");
      }

      schoolId = schoolRow.id;

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

      // eslint-disable-next-line no-console
      console.log("[db] Initial data seeded (PostgreSQL)");
    } else {
      schoolId = existing[0].id;
    }

    // Check if Week 3 data already seeded
    const termsExist = await db
      .select()
      .from(pgSchema.term)
      .where(eq(pgSchema.term.school_id, schoolId))
      .limit(1);

    if (termsExist.length > 0) {
      // eslint-disable-next-line no-console
      console.log("[db] Seed skipped (Week 3 data already seeded).");
      return;
    }

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
    ]);

    // Seed Class Levels (Chad Education System)
    await db.insert(pgSchema.classLevel).values([
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
    ]);

    // Seed Subjects
    await db.insert(pgSchema.subject).values([
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
        name: "Sciences Physiques",
        code: "PHY",
        description: "Physique et sciences naturelles",
      },
      {
        school_id: schoolId,
        name: "Sciences Naturelles",
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

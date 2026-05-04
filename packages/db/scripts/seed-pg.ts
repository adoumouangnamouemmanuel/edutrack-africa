import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import * as schema from "../src/schema/pg";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("[db] DATABASE_URL is required for PostgreSQL seed.");
  }

  const pool = new pg.Pool({ connectionString });
  const db = drizzle(pool, { schema });

  try {
    const existing = await db.select().from(schema.school).limit(1);
    if (existing.length > 0) {
      // eslint-disable-next-line no-console
      console.log("[db] Seed skipped (school already exists).");
      return;
    }

    const passwordHash = bcrypt.hashSync("ChangeMoi2026!", 12);

    const [schoolRow] = await db
      .insert(schema.school)
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

    await db.insert(schema.academicYear).values({
      school_id: schoolId,
      label: "2025–2026",
      start_date: "2025-09-01",
      end_date: "2026-06-30",
      is_current: true,
      grading_system: "trimesters",
    });

    await db.insert(schema.user).values({
      school_id: schoolId,
      username: "directeur.demo",
      password_hash: passwordHash,
      role: "school_master",
      is_active: true,
    });

    // eslint-disable-next-line no-console
    console.log(`[db] Seed complete (PostgreSQL) → school id ${schoolId}`);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

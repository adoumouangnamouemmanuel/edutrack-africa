import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

import { pgSchema } from "../src/schema";

// Ensure repo-root .env is loaded
const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.resolve(pkgRoot, "..", "..", ".env") });

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("[db] DATABASE_URL is required.");
  }

  const pool = new pg.Pool({ connectionString });
  const db = drizzle(pool, { schema: pgSchema });

  try {
    const existing = await db.select().from(pgSchema.school).limit(1);
    if (existing.length === 0) {
      console.log("[db] No school found.");
      return;
    }

    const schoolId = existing[0].id;

    // Delete Week 3 data
    await db.delete(pgSchema.subject).where(eq(pgSchema.subject.school_id, schoolId));
    await db
      .delete(pgSchema.classLevel)
      .where(eq(pgSchema.classLevel.school_id, schoolId));
    await db.delete(pgSchema.term).where(eq(pgSchema.term.school_id, schoolId));

    console.log("[db] Week 3 data cleared (PostgreSQL)");
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

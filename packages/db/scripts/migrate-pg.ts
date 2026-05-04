import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const migrationsFolder = path.join(pkgRoot, "drizzle", "pg");

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "[db] DATABASE_URL is required for PostgreSQL migrations (postgresql://…)",
    );
  }

  const pool = new pg.Pool({ connectionString });
  const db = drizzle(pool);

  try {
    await migrate(db, { migrationsFolder });
    // eslint-disable-next-line no-console
    console.log("[db] PostgreSQL migrations applied.");
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

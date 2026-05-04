import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ensureSqliteDirectory, resolveSqliteFilePath } from "./resolve-sqlite-path";

const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const migrationsFolder = path.join(pkgRoot, "drizzle", "sqlite");

const filePath = resolveSqliteFilePath();
ensureSqliteDirectory(filePath);

const sqlite = new Database(filePath);
const db = drizzle(sqlite);

try {
  migrate(db, { migrationsFolder });
  // eslint-disable-next-line no-console
  console.log(`[db] SQLite migrations applied → ${filePath}`);
} finally {
  sqlite.close();
}

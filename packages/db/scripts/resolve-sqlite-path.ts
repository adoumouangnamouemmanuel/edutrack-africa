import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Returns absolute filesystem path for the SQLite database file. */
export function resolveSqliteFilePath(): string {
  const fromEnv = process.env.DATABASE_URL_SQLITE;
  if (fromEnv?.startsWith("file:")) {
    const raw = fromEnv.slice("file:".length);
    return path.isAbsolute(raw) ? raw : path.resolve(process.cwd(), raw);
  }
  return path.join(pkgRoot, ".data", "edutrack.sqlite");
}

export function ensureSqliteDirectory(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

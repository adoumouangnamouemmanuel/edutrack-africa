import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, "../.data/edutrack.sqlite");

const sqlite = new Database(dbPath);
const db = drizzle(sqlite);

console.log("\n📊 SQLite Database Indexes Verification\n");

const tables = ["term", "class_level", "subject"];

for (const table of tables) {
  const indexes = sqlite.prepare(`PRAGMA index_list(${table})`).all() as any[];

  console.log(`\n📋 Table: ${table}`);
  if (indexes.length === 0) {
    console.log("   ⚠️  No indexes found");
    continue;
  }

  for (const idx of indexes) {
    const info = sqlite.prepare(`PRAGMA index_info(${idx.name})`).all() as any[];
    const cols = info.map((i: any) => i.name).join(", ");
    const unique = idx.unique ? "✅ UNIQUE" : "ℹ️  Regular";
    console.log(`   ${unique}: ${idx.name}`);
    console.log(`      Columns: ${cols}`);
  }
}

console.log("\n✅ Verification complete!\n");

sqlite.close();

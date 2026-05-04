import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import { sqliteSchema } from "../src/schema";
import { resolveSqliteFilePath } from "./resolve-sqlite-path";

const filePath = resolveSqliteFilePath();
const raw = new Database(filePath);
const db = drizzle(raw, { schema: sqliteSchema });

const schools = db.select().from(sqliteSchema.school).all();
const terms = db.select().from(sqliteSchema.term).all();
const levels = db.select().from(sqliteSchema.classLevel).all();
const subjects = db.select().from(sqliteSchema.subject).all();

console.log("=== SQLite Data Verification ===");
console.log(`Schools: ${schools.length}`);
console.log(`Terms: ${terms.length}`);
console.log(`ClassLevels: ${levels.length}`);
console.log(`Subjects: ${subjects.length}`);

if (schools.length > 0) {
  console.log("\nSchool:", schools[0].name);
}

if (terms.length > 0) {
  console.log("Terms seeded:");
  terms.forEach((t) => console.log(`  - ${t.label}`));
}

if (levels.length > 0) {
  console.log("Class Levels seeded:");
  levels.forEach((l) => console.log(`  - ${l.name}`));
}

if (subjects.length > 0) {
  console.log("Subjects seeded:");
  subjects.forEach((s) => console.log(`  - ${s.name}`));
}

raw.close();

// @ts-nocheck
import { drizzle } from "drizzle-orm/postgres-js";
import path from "path";
import postgres from "postgres";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const connStr =
  process.env.DATABASE_URL || "postgresql://edutrack:password@localhost:5433/edutrack";

const client = postgres(connStr, { onnotice: () => {} });
const db = drizzle(client);

console.log("\n📊 PostgreSQL Database Indexes & Constraints Verification\n");

const tables = ["term", "class_level", "subject"];

for (const table of tables) {
  console.log(`\n📋 Table: ${table}`);

  // Get all indexes for this table
  const indexes = await db.execute(`
    SELECT 
      indexname,
      indexdef
    FROM pg_indexes 
    WHERE tablename = '${table}'
    ORDER BY indexname
  `);

  if ((indexes as any).length === 0) {
    console.log("   ⚠️  No indexes found");
  } else {
    for (const idx of indexes as any) {
      const isUnique = idx.indexdef.includes("UNIQUE") ? "✅ UNIQUE" : "ℹ️  Regular";
      console.log(`   ${isUnique}: ${idx.indexname}`);
    }
  }

  // Get constraints
  const constraints = await db.execute(`
    SELECT 
      constraint_name,
      constraint_type
    FROM information_schema.table_constraints
    WHERE table_name = '${table}'
      AND constraint_type = 'UNIQUE'
    ORDER BY constraint_name
  `);

  if ((constraints as any).length > 0) {
    console.log(`   Constraints:`);
    for (const con of constraints as any) {
      console.log(`      ✅ ${con.constraint_type}: ${con.constraint_name}`);
    }
  }
}

console.log("\n✅ Verification complete!\n");

await client.end();

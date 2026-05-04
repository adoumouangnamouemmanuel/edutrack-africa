import path from "node:path";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema/sqlite.ts",
  out: "./drizzle/sqlite",
  dialect: "sqlite",
  dbCredentials: {
    url:
      process.env.DATABASE_URL_SQLITE ??
      `file:${path.resolve(process.cwd(), ".data", "edutrack.sqlite")}`,
  },
});

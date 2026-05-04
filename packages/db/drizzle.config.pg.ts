import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema/pg.ts",
  out: "./drizzle/pg",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://edutrack:edutrack@127.0.0.1:5433/edutrack",
  },
});

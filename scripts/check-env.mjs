#!/usr/bin/env node
/**
 * Quick local check: Node version matches repo engines (see root package.json).
 * Run: node scripts/check-env.mjs
 */
import process from "node:process";

const major = Number.parseInt(process.version.slice(1).split(".")[0] ?? "0", 10);
if (Number.isNaN(major) || major < 20) {
  console.error(
    `[edutrack] Node.js 20+ required. Current: ${process.version}. Install Node 20 LTS.`,
  );
  process.exit(1);
}
console.log(`[edutrack] Node ${process.version} — OK`);

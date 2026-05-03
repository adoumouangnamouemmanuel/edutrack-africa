import path from "node:path";

function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

/** @type {import("lint-staged").Configuration} */
export default {
  "*.{json,yml,yaml,md,css}": "prettier --write",
  "*.{ts,tsx,js,mjs,cjs}": (files) => {
    const normalized = files.map(toPosix);
    const cmds = [
      `prettier --write ${normalized.map((f) => JSON.stringify(f)).join(" ")}`,
    ];
    const webFiles = normalized.filter((f) => f.startsWith("apps/web/"));
    if (webFiles.length > 0) {
      const rel = webFiles.map((f) => f.slice("apps/web/".length));
      cmds.push(
        `pnpm --filter @edutrack/web exec eslint --max-warnings 0 --fix ${rel.map((f) => JSON.stringify(f)).join(" ")}`,
      );
    }
    return cmds;
  },
};

const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const apiDir = path.join(process.cwd(), "app", "api");
const tempApiDir = path.join(process.cwd(), "app", "_api_temp");
const nextDir = path.join(process.cwd(), ".next");

console.log("Preparing Cloudflare Pages static build...");

let moved = false;
try {
  if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log("Cleaned .next cache.");
  }

  if (fs.existsSync(apiDir)) {
    fs.renameSync(apiDir, tempApiDir);
    moved = true;
    console.log("Temporarily stashed app/api for static export.");
  }

  console.log("Running Next.js static export build...");
  execSync("npx next build", {
    stdio: "inherit",
    env: { ...process.env, STATIC_EXPORT: "true" },
  });
  console.log("Static export build succeeded! Output generated in out/");
} catch (err) {
  console.error("Build failed:", err.message);
  process.exitCode = 1;
} finally {
  if (moved && fs.existsSync(tempApiDir)) {
    fs.renameSync(tempApiDir, apiDir);
    console.log("Restored app/api.");
  }
}

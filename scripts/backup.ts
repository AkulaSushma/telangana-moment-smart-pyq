import { DatabaseSync } from "node:sqlite";
import { mkdirSync, statSync } from "node:fs";
import { join } from "node:path";

const dataDir = process.env.PYQ_DATA_DIR || join(process.cwd(), "data");
const dbPath = join(dataDir, "learning.sqlite");
const backupDir = join(dataDir, "backups");

mkdirSync(backupDir, { recursive: true });

const timestamp = new Date()
  .toISOString()
  .replace(/[:.]/g, "-")
  .replace("T", "_")
  .replace("Z", "");
const targetBackupPath = join(backupDir, `learning_${timestamp}.sqlite`);
const latestBackupPath = join(backupDir, "learning_latest.sqlite");

console.log(`Starting production SQLite backup...`);
console.log(`Source database: ${dbPath}`);
console.log(`Destination: ${targetBackupPath}`);

try {
  const sourceDb = new DatabaseSync(dbPath);
  
  // Create consistent atomic snapshot via VACUUM INTO
  sourceDb.exec(`VACUUM INTO '${targetBackupPath.replace(/\\/g, "/")}'`);
  sourceDb.close();

  // Verify integrity of the newly created snapshot
  const backupDb = new DatabaseSync(targetBackupPath);
  const checkResult = backupDb.prepare("PRAGMA integrity_check").all() as { integrity_check: string }[];
  backupDb.close();

  const isOk = checkResult.length === 1 && checkResult[0].integrity_check === "ok";
  if (!isOk) {
    throw new Error(`Integrity check failed on backup snapshot: ${JSON.stringify(checkResult)}`);
  }

  const stats = statSync(targetBackupPath);
  console.log(`Backup completed and verified successfully!`);
  console.log(`Size: ${(stats.size / 1024).toFixed(2)} KB`);
  console.log(`Integrity check: PASS (ok)`);
} catch (err) {
  console.error("Backup failed:", err);
  process.exit(1);
}

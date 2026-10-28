import { DatabaseSync } from "node:sqlite";
import { existsSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

// SQLite provides a consistent snapshot including committed WAL data.
const dataDirectory = resolve(process.env.PYQ_DATA_DIR || "data");
const backupDirectory = resolve("../smart-pyq-checkpoints");
mkdirSync(backupDirectory, {recursive:true});
const source = join(dataDirectory,"learning.sqlite");
if (!existsSync(source)) throw new Error("No learning database exists to back up.");
const destination = join(backupDirectory,`learning-${new Date().toISOString().replace(/[:.]/g,"-")}.sqlite`);
const db = new DatabaseSync(source);
try {
  db.exec("PRAGMA busy_timeout=5000");
  db.prepare("VACUUM INTO ?").run(destination);
  const snapshot = new DatabaseSync(destination,{readOnly:true});
  try {
    const row = snapshot.prepare("PRAGMA integrity_check").get() as {integrity_check:string};
    if (row.integrity_check !== "ok") throw new Error("Checkpoint integrity check failed.");
  } finally {snapshot.close();}
  console.log(`Verified local database checkpoint: ${destination}`);
} finally {db.close();}

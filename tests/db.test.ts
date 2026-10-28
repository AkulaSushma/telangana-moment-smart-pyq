import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
process.env.PYQ_DATA_DIR = mkdtempSync(join(tmpdir(), "sadhana-db-test-"));
test("database persists isolated profiles and rolls back rejected mutations", async () => {
  const { createProfile, readLearner, mutate } = await import("../lib/db");
  const a = createProfile(true),
    b = createProfile(true);
  assert.notEqual(a.id, b.id);
  assert.notEqual(a.attempts[0].id, b.attempts[0].id);
  mutate(a.id, (s) => {
    s.bookmarks.push("TM-Q001");
    return s;
  });
  assert.deepEqual(readLearner(a.id)!.bookmarks, ["TM-Q001"]);
  assert.deepEqual(readLearner(b.id)!.bookmarks, []);
  assert.throws(() =>
    mutate(a.id, (s) => {
      s.target = "Constable";
      throw new Error("rollback");
    }),
  );
  assert.equal(readLearner(a.id)!.target, "SI");
});

import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

process.env.PYQ_DATA_DIR = mkdtempSync(join(tmpdir(), "sadhana-auth-test-"));

test("auth: registration, session creation, duplicate prevention, and profile isolation", async () => {
  const { db } = await import("../lib/db");
  const {
    registerUser,
    loginUser,
    getUserBySession,
    logoutUser,
    updateUserTarget,
  } = await import("../lib/auth");

  // 1. Register User A
  const resA = registerUser(db, {
    name: "Ramesh Goud",
    email: "ramesh@example.com",
    password: "Password123",
    target: "SI",
  });

  assert.equal(resA.user.name, "Ramesh Goud");
  assert.equal(resA.user.email, "ramesh@example.com");
  assert.equal(resA.user.target, "SI");
  assert.ok(resA.sessionToken.startsWith("sess_"));
  assert.ok(resA.learnerId);

  // Verify User A profile exists in profiles table
  const profileA = db.prepare("SELECT id FROM profiles WHERE id = ?").get(resA.learnerId);
  assert.ok(profileA);

  // 2. Reject duplicate registration
  assert.throws(
    () => {
      registerUser(db, {
        name: "Ramesh Duplicate",
        email: "ramesh@example.com",
        password: "AnotherPassword123",
      });
    },
    /already exists/i,
  );

  // 3. Register User B (Constable target)
  const resB = registerUser(db, {
    name: "Suresh Yadav",
    email: "suresh@example.com",
    password: "Password456",
    target: "Constable",
  });

  assert.equal(resB.user.name, "Suresh Yadav");
  assert.equal(resB.user.target, "Constable");
  assert.notEqual(resA.learnerId, resB.learnerId, "Users must have isolated learner IDs");

  // 4. Session verification
  const sessionUserA = getUserBySession(db, resA.sessionToken);
  assert.ok(sessionUserA);
  assert.equal(sessionUserA.email, "ramesh@example.com");
  assert.equal(sessionUserA.learnerId, resA.learnerId);

  // 5. Login verification
  const loginRes = loginUser(db, {
    email: "ramesh@example.com",
    password: "Password123",
  });
  assert.equal(loginRes.user.id, resA.user.id);
  assert.equal(loginRes.learnerId, resA.learnerId);

  // 6. Wrong password rejection
  assert.throws(
    () => {
      loginUser(db, {
        email: "ramesh@example.com",
        password: "WrongPassword",
      });
    },
    /invalid email or password/i,
  );

  // 7. Update target
  updateUserTarget(db, resA.user.id, "Constable");
  const updatedUserA = getUserBySession(db, resA.sessionToken);
  assert.equal(updatedUserA?.target, "Constable");

  // 8. Logout
  logoutUser(db, resA.sessionToken);
  assert.equal(getUserBySession(db, resA.sessionToken), null);
});

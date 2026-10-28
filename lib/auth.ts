import { DatabaseSync } from "node:sqlite";
import crypto from "node:crypto";
import { createProfile, mutate } from "./db";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  target: "SI" | "Constable";
  createdAt: number;
};

export type AuthSessionResult = {
  user: AuthUser;
  sessionToken: string;
  learnerId: string;
};

export function initAuthTables(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      target TEXT NOT NULL DEFAULT 'SI',
      learner_id TEXT NOT NULL REFERENCES profiles(id),
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      expires_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
  `);
}

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { hash, salt };
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  try {
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(expectedHash, "hex");
    if (derivedKey.length !== keyBuffer.length) return false;
    return crypto.timingSafeEqual(derivedKey, keyBuffer);
  } catch {
    return false;
  }
}

export function registerUser(
  db: DatabaseSync,
  input: {
    name: string;
    email: string;
    password: string;
    target?: "SI" | "Constable";
  },
): AuthSessionResult {
  const name = input.name?.trim();
  const email = input.email?.trim().toLowerCase();
  const password = input.password;
  const target = input.target === "Constable" ? "Constable" : "SI";

  if (!name || name.length < 2) {
    throw new Error("Please enter your full name (minimum 2 characters).");
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please enter a valid email address.");
  }
  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  initAuthTables(db);

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    throw new Error("An account with this email already exists. Please sign in instead.");
  }

  // Create an isolated learner instance for this user
  const learner = createProfile(false, db);
  if (target === "Constable") {
    mutate(
      learner.id,
      (s) => {
        s.target = "Constable";
        return s;
      },
      db,
    );
  }

  const { hash, salt } = hashPassword(password);
  const now = Date.now();
  const userId = "usr_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);

  db.prepare(`
    INSERT INTO users (id, email, name, password_hash, salt, target, learner_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(userId, email, name, hash, salt, target, learner.id, now, now);

  const sessionToken = "sess_" + crypto.randomBytes(32).toString("hex");
  const expiresAt = now + 30 * 24 * 60 * 60 * 1000; // 30 days session

  db.prepare(`
    INSERT INTO sessions (id, user_id, expires_at, created_at)
    VALUES (?, ?, ?, ?)
  `).run(sessionToken, userId, expiresAt, now);

  return {
    user: {
      id: userId,
      name,
      email,
      target,
      createdAt: now,
    },
    sessionToken,
    learnerId: learner.id,
  };
}

export function loginUser(
  db: DatabaseSync,
  input: {
    email: string;
    password: string;
  },
): AuthSessionResult {
  const email = input.email?.trim().toLowerCase();
  const password = input.password;

  if (!email || !password) {
    throw new Error("Please enter both email and password.");
  }

  initAuthTables(db);

  const row = db.prepare(`
    SELECT id, email, name, password_hash, salt, target, learner_id, created_at
    FROM users WHERE email = ?
  `).get(email) as
    | {
        id: string;
        email: string;
        name: string;
        password_hash: string;
        salt: string;
        target: "SI" | "Constable";
        learner_id: string;
        created_at: number;
      }
    | undefined;

  if (!row) {
    throw new Error("Invalid email or password.");
  }

  const isValid = verifyPassword(password, row.salt, row.password_hash);
  if (!isValid) {
    throw new Error("Invalid email or password.");
  }

  const now = Date.now();
  const sessionToken = "sess_" + crypto.randomBytes(32).toString("hex");
  const expiresAt = now + 30 * 24 * 60 * 60 * 1000; // 30 days

  db.prepare(`
    INSERT INTO sessions (id, user_id, expires_at, created_at)
    VALUES (?, ?, ?, ?)
  `).run(sessionToken, row.id, expiresAt, now);

  return {
    user: {
      id: row.id,
      name: row.name,
      email: row.email,
      target: row.target,
      createdAt: row.created_at,
    },
    sessionToken,
    learnerId: row.learner_id,
  };
}

export function getUserBySession(
  db: DatabaseSync,
  sessionToken?: string | null,
): (AuthUser & { learnerId: string }) | null {
  if (!sessionToken) return null;

  initAuthTables(db);

  const now = Date.now();
  const sessionRow = db.prepare(`
    SELECT user_id, expires_at FROM sessions WHERE id = ?
  `).get(sessionToken) as { user_id: string; expires_at: number } | undefined;

  if (!sessionRow) return null;

  if (sessionRow.expires_at < now) {
    db.prepare("DELETE FROM sessions WHERE id = ?").run(sessionToken);
    return null;
  }

  const userRow = db.prepare(`
    SELECT id, email, name, target, learner_id, created_at FROM users WHERE id = ?
  `).get(sessionRow.user_id) as
    | {
        id: string;
        email: string;
        name: string;
        target: "SI" | "Constable";
        learner_id: string;
        created_at: number;
      }
    | undefined;

  if (!userRow) return null;

  return {
    id: userRow.id,
    name: userRow.name,
    email: userRow.email,
    target: userRow.target,
    learnerId: userRow.learner_id,
    createdAt: userRow.created_at,
  };
}

export function logoutUser(db: DatabaseSync, sessionToken?: string | null): void {
  if (!sessionToken) return;
  initAuthTables(db);
  db.prepare("DELETE FROM sessions WHERE id = ?").run(sessionToken);
}

export function updateUserTarget(
  db: DatabaseSync,
  userId: string,
  target: "SI" | "Constable",
): void {
  initAuthTables(db);
  const now = Date.now();
  const user = db.prepare("SELECT learner_id FROM users WHERE id = ?").get(userId) as
    | { learner_id: string }
    | undefined;

  db.prepare("UPDATE users SET target = ?, updated_at = ? WHERE id = ?").run(
    target,
    now,
    userId,
  );

  if (user?.learner_id) {
    mutate(
      user.learner_id,
      (s) => {
        s.target = target;
        return s;
      },
      db,
    );
  }
}

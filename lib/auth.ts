import { cookies } from "next/headers";
import { scrypt } from "scrypt-js";
import { getDb } from "@/lib/db";

const encoder = new TextEncoder();
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LEN = 64;
const SESSION_COOKIE = "session_token";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

type AuthUser = {
  id: string;
  username: string;
};

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

function toBase64Url(bytes: Uint8Array): string {
  return bytesToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function hashToken(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(token));
  return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, "0")).join("");
}

async function derivePasswordHash(password: string, saltBase64: string) {
  const passwordBytes = encoder.encode(password.normalize("NFKC"));
  const saltBytes = base64ToBytes(saltBase64);
  const result = await scrypt(passwordBytes, saltBytes, SCRYPT_N, SCRYPT_R, SCRYPT_P, KEY_LEN);
  return bytesToBase64(Uint8Array.from(result));
}

async function issueSession(userId: string) {
  const db = await getDb();
  const random = new Uint8Array(32);
  crypto.getRandomValues(random);
  const token = toBase64Url(random);
  const tokenHash = await hashToken(token);
  const now = Date.now();
  const expiresAt = now + SESSION_TTL_MS;

  await db.execute({
    sql: "INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)",
    args: [tokenHash, userId, now, expiresAt],
  });

  return { token, expiresAt };
}

async function setSessionCookie(token: string, expiresAt: number) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: new Date(expiresAt),
    path: "/",
  });
}

export async function registerUser(username: string, password: string) {
  const db = await getDb();
  const normalizedUsername = username.trim().toLowerCase();
  const saltBytes = new Uint8Array(16);
  crypto.getRandomValues(saltBytes);
  const passwordSalt = bytesToBase64(saltBytes);
  const passwordHash = await derivePasswordHash(password, passwordSalt);
  const userId = crypto.randomUUID();

  await db.execute({
    sql: "INSERT INTO users (id, username, password_hash, password_salt, created_at) VALUES (?, ?, ?, ?, ?)",
    args: [userId, normalizedUsername, passwordHash, passwordSalt, Date.now()],
  });

  const { token, expiresAt } = await issueSession(userId);
  await setSessionCookie(token, expiresAt);

  return { id: userId, username: normalizedUsername };
}

export async function loginUser(username: string, password: string): Promise<AuthUser | null> {
  const db = await getDb();
  const normalizedUsername = username.trim().toLowerCase();

  const result = await db.execute({
    sql: "SELECT id, username, password_hash, password_salt FROM users WHERE username = ? LIMIT 1",
    args: [normalizedUsername],
  });

  if (!result.rows[0]) {
    return null;
  }

  const row = result.rows[0];
  const derived = await derivePasswordHash(password, String(row.password_salt));

  if (derived !== String(row.password_hash)) {
    return null;
  }

  const { token, expiresAt } = await issueSession(String(row.id));
  await setSessionCookie(token, expiresAt);

  return {
    id: String(row.id),
    username: String(row.username),
  };
}

export async function logoutUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    const db = await getDb();
    const tokenHash = await hashToken(token);
    await db.execute({
      sql: "DELETE FROM sessions WHERE token_hash = ?",
      args: [tokenHash],
    });
  }

  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const tokenHash = await hashToken(token);
  const db = await getDb();
  const now = Date.now();

  const result = await db.execute({
    sql: `
      SELECT users.id AS id, users.username AS username
      FROM sessions
      JOIN users ON users.id = sessions.user_id
      WHERE sessions.token_hash = ? AND sessions.expires_at > ?
      LIMIT 1
    `,
    args: [tokenHash, now],
  });

  if (!result.rows[0]) {
    return null;
  }

  return {
    id: String(result.rows[0].id),
    username: String(result.rows[0].username),
  };
}

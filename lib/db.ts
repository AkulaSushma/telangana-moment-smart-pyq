import { createClient, type Client } from "@libsql/client";
import { SEEDED_QUESTIONS } from "@/lib/questions";

let dbClient: Client | null = null;
let initPromise: Promise<void> | null = null;

function client(): Client {
  if (dbClient) {
    return dbClient;
  }

  dbClient = createClient({
    url: process.env.DATABASE_URL ?? "file:./platform.db",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  return dbClient;
}

async function initialize() {
  const db = client();

  await db.batch(
    [
      `
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          password_salt TEXT NOT NULL,
          created_at INTEGER NOT NULL
        )
      `,
      `
        CREATE TABLE IF NOT EXISTS sessions (
          token_hash TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          expires_at INTEGER NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `,
      `
        CREATE TABLE IF NOT EXISTS questions (
          id INTEGER PRIMARY KEY,
          prompt TEXT NOT NULL,
          option_a TEXT NOT NULL,
          option_b TEXT NOT NULL,
          option_c TEXT NOT NULL,
          option_d TEXT NOT NULL,
          answer TEXT NOT NULL,
          explanation TEXT NOT NULL,
          source TEXT NOT NULL
        )
      `,
      `
        CREATE TABLE IF NOT EXISTS mistake_queue (
          user_id TEXT NOT NULL,
          question_id INTEGER NOT NULL,
          next_review_at INTEGER NOT NULL,
          interval_days INTEGER NOT NULL,
          streak INTEGER NOT NULL,
          ease REAL NOT NULL,
          updated_at INTEGER NOT NULL,
          PRIMARY KEY (user_id, question_id),
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (question_id) REFERENCES questions(id)
        )
      `,
    ].map((sql) => ({ sql })),
    "write",
  );

  const existingCountResult = await db.execute("SELECT COUNT(1) AS count FROM questions");
  const existingCount = Number(existingCountResult.rows[0]?.count ?? 0);

  if (existingCount >= 150) {
    return;
  }

  for (const q of SEEDED_QUESTIONS) {
    await db.execute({
      sql: `
        INSERT OR IGNORE INTO questions (
          id,
          prompt,
          option_a,
          option_b,
          option_c,
          option_d,
          answer,
          explanation,
          source
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        q.id,
        q.prompt,
        q.optionA,
        q.optionB,
        q.optionC,
        q.optionD,
        q.answer,
        q.explanation,
        q.source,
      ],
    });
  }
}

export async function getDb() {
  if (!initPromise) {
    initPromise = initialize();
  }

  await initPromise;
  return client();
}

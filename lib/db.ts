import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { createLearner, type Learner } from "./engine";
import { questions } from "./content";
import {
  initializeCorpus,
  seedCorpus,
  getCorpusQuestion,
  listCorpusQuestions,
  corpusSummary,
} from "./corpus";
const dir = process.env.PYQ_DATA_DIR || join(process.cwd(), "data");
mkdirSync(dir, { recursive: true });
const db = new DatabaseSync(join(dir, "learning.sqlite"));
const eventColumns = db.prepare("PRAGMA table_info(attempt_events)").all() as {
  name: string;
  type: string;
}[];
if (eventColumns.some((c) => c.name === "id" && c.type === "INTEGER")) {
  db.exec(`BEGIN IMMEDIATE; ALTER TABLE attempt_events RENAME TO attempt_events_v0;
 CREATE TABLE attempt_events(id TEXT PRIMARY KEY,profile_id TEXT NOT NULL REFERENCES profiles(id),type TEXT NOT NULL,question_id TEXT,value TEXT,created_at INTEGER NOT NULL);
 INSERT INTO attempt_events SELECT 'legacy-' || id,profile_id,type,question_id,value,created_at FROM attempt_events_v0; COMMIT;`);
}
db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
 CREATE TABLE IF NOT EXISTS profiles(id TEXT PRIMARY KEY, state TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 0, updated_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS questions(id TEXT PRIMARY KEY, topic_id TEXT NOT NULL, model_id TEXT NOT NULL, source_status TEXT NOT NULL, content TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS attempts(id TEXT PRIMARY KEY, profile_id TEXT NOT NULL REFERENCES profiles(id), question_id TEXT NOT NULL REFERENCES questions(id), selected INTEGER NOT NULL, correct INTEGER NOT NULL, confidence INTEGER NOT NULL, seconds REAL NOT NULL, hint INTEGER NOT NULL, session_id TEXT NOT NULL, demo INTEGER NOT NULL, created_at INTEGER NOT NULL);
 CREATE INDEX IF NOT EXISTS attempt_profile ON attempts(profile_id,created_at);
 CREATE TABLE IF NOT EXISTS attempt_events(id TEXT PRIMARY KEY, profile_id TEXT NOT NULL REFERENCES profiles(id), type TEXT NOT NULL, question_id TEXT, value TEXT, created_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS bookmarks(profile_id TEXT NOT NULL REFERENCES profiles(id), question_id TEXT NOT NULL REFERENCES questions(id), PRIMARY KEY(profile_id,question_id));
 CREATE TABLE IF NOT EXISTS revision_items(profile_id TEXT NOT NULL REFERENCES profiles(id), question_id TEXT NOT NULL REFERENCES questions(id), due_at INTEGER NOT NULL, interval_days INTEGER NOT NULL, reason TEXT NOT NULL, PRIMARY KEY(profile_id,question_id));
 CREATE TABLE IF NOT EXISTS learning_sessions(id TEXT PRIMARY KEY, profile_id TEXT NOT NULL REFERENCES profiles(id), started_at INTEGER NOT NULL, completed INTEGER NOT NULL, plan TEXT NOT NULL);
`);
const seed = db.prepare("INSERT OR IGNORE INTO questions VALUES(?,?,?,?,?)");
for (const q of questions)
  seed.run(q.id, q.topic, q.modelId, q.sourceStatus, JSON.stringify(q));
initializeCorpus(db);
seedCorpus(db, questions);
export { db };
const attemptColumns = db.prepare("PRAGMA table_info(attempts)").all() as {
  name: string;
}[];
if (!attemptColumns.some((c) => c.name === "question_version"))
  db.exec(
    "ALTER TABLE attempts ADD COLUMN question_version INTEGER NOT NULL DEFAULT 1",
  );
export const findQuestion = (id: string, version?: number) =>
  getCorpusQuestion(db, id, version);
export const queryQuestions = (
  filters: Parameters<typeof listCorpusQuestions>[1] = {},
) => listCorpusQuestions(db, filters);
export const corpusCounts = () => corpusSummary(db);
export function practiceCandidates(state: Learner, kind: string) {
  const stageOperator = kind === "recall" ? "=" : "<>";
  const rows = db
    .prepare(
      `SELECT q.id FROM corpus_questions q LEFT JOIN (
    SELECT question_id, count(*) AS exposures, max(created_at) AS last_seen FROM attempts WHERE profile_id=? AND demo=0 GROUP BY question_id
  ) a ON a.question_id=q.id
  WHERE q.published_version IS NOT NULL AND q.stage ${stageOperator} 'recall'
  ORDER BY coalesce(a.exposures,0), coalesce(a.last_seen,0), q.id LIMIT 50`,
    )
    .all(state.id) as { id: string }[];
  return rows.map((r) => findQuestion(r.id)).filter((q) => q !== null);
}
export function learnerQuestionPool(state: Learner) {
  const ids = new Set([
    ...state.attempts.map((a) => a.questionId),
    ...state.bookmarks,
    ...state.revisions.map((r) => r.questionId),
    ...(state.session?.queue || []),
  ]);
  return [...ids]
    .map((id) => findQuestion(id, state.session?.versions?.[id]))
    .filter((q) => q !== null);
}
function ensureQuestionReference(id: string, targetDb: DatabaseSync = db) {
  const q = findQuestion(id);
  if (!q) throw new Error("This question is no longer available for practice.");
  targetDb
    .prepare("INSERT OR IGNORE INTO questions VALUES(?,?,?,?,?)")
    .run(q.id, q.topic, q.modelId, q.sourceStatus, JSON.stringify(q));
}
export function readLearner(
  id: string,
  targetDb: DatabaseSync = db,
): Learner | null {
  const row = targetDb
    .prepare("SELECT state FROM profiles WHERE id=?")
    .get(id) as { state: string } | undefined;
  return row ? JSON.parse(row.state) : null;
}
export function createProfile(
  demo = true,
  targetDb: DatabaseSync = db,
): Learner {
  const s = createLearner(crypto.randomUUID(), demo);
  targetDb
    .prepare("INSERT INTO profiles VALUES(?,?,0,?)")
    .run(s.id, JSON.stringify(s), Date.now());
  return mutate(s.id, (x) => x, targetDb);
}
export function mutate(
  id: string,
  fn: (state: Learner) => Learner,
  targetDb: DatabaseSync = db,
): Learner {
  targetDb.exec("BEGIN IMMEDIATE");
  try {
    const state = readLearner(id, targetDb);
    if (!state) throw new Error("Profile not found");
    const oldEvents = new Set(state.events.map((e) => e.id));
    const updated = fn(state);
    targetDb
      .prepare(
        "UPDATE profiles SET state=?,version=version+1,updated_at=? WHERE id=?",
      )
      .run(JSON.stringify(updated), Date.now(), id);
    const insert = targetDb.prepare(
      "INSERT OR IGNORE INTO attempts(id,profile_id,question_id,selected,correct,confidence,seconds,hint,session_id,demo,created_at,question_version) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
    );
    for (const a of updated.attempts) {
      ensureQuestionReference(a.questionId, targetDb);
      insert.run(
        a.id,
        id,
        a.questionId,
        a.selected,
        Number(a.correct),
        a.confidence,
        a.seconds,
        Number(a.hint),
        a.sessionId,
        Number(a.demo),
        a.at,
        a.questionVersion || 1,
      );
    }
    const event = targetDb.prepare(
      "INSERT OR IGNORE INTO attempt_events(id,profile_id,type,question_id,value,created_at) VALUES(?,?,?,?,?,?)",
    );
    for (const e of updated.events.filter((e) => !oldEvents.has(e.id)))
      event.run(e.id, id, e.type, e.questionId || null, e.value || null, e.at);
    targetDb.prepare("DELETE FROM bookmarks WHERE profile_id=?").run(id);
    for (const q of updated.bookmarks) {
      ensureQuestionReference(q, targetDb);
      targetDb.prepare("INSERT INTO bookmarks VALUES(?,?)").run(id, q);
    }
    targetDb.prepare("DELETE FROM revision_items WHERE profile_id=?").run(id);
    for (const r of updated.revisions) {
      ensureQuestionReference(r.questionId, targetDb);
      targetDb.prepare("INSERT INTO revision_items VALUES(?,?,?,?,?)").run(
        id,
        r.questionId,
        r.due,
        r.intervalDays,
        r.reason,
      );
    }
    if (updated.session) {
      const s = updated.session;
      targetDb
        .prepare(
          "INSERT INTO learning_sessions VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET completed=excluded.completed,plan=excluded.plan",
        )
        .run(s.id, id, s.started, Number(s.completed), JSON.stringify(s));
    }
    targetDb.exec("COMMIT");
    return updated;
  } catch (e) {
    targetDb.exec("ROLLBACK");
    throw e;
  }
}

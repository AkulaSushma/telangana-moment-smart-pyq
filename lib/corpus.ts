import { createHash } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { z } from "zod";
import type { Question } from "./content";
import { getTeaching, hasAuthoredTeaching } from "./teaching";

// This module is server-only by dependency: never import it into a client component.
export type VersionedQuestion = Question & { version: number };
export const sourceStatusLabels = [
  "VERIFIED PYQ",
  "VERIFIED QUESTION TEXT — KEY UNVERIFIED",
  "PARTIALLY VERIFIED QUESTION",
  "MEMORY-BASED QUESTION",
  "GENERATED PRACTICE QUESTION",
  "EXPECTED PRACTICE QUESTION",
] as const;
const text = z.string().trim().min(1).max(20000);
const id = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/);
const status = z.enum(sourceStatusLabels);
const teachingSchema = z
  .object({
    observation: text,
    correctMeaning: text,
    selectedMeaning: text,
    possibleConfusion: text,
    decisionRules: z
      .array(z.object({ when: text, choose: text }).strict())
      .min(2)
      .max(6),
    nextStep: text,
  })
  .strict();
const questionSchema = z
  .object({
    id,
    topic: id,
    concept: id,
    model: z.enum([
      "Recognition",
      "Provision identification",
      "Chronology",
      "Statements",
      "Negative wording",
      "Changed wording",
    ]),
    modelId: id,
    stage: z.enum(["recognition", "practice", "rewording", "recall"]),
    prompt: text,
    options: z
      .array(
        z
          .object({
            text,
            why: text,
            attraction: text,
            confusion: z.boolean().optional(),
          })
          .strict(),
      )
      .length(4),
    answer: z.number().int().min(0).max(3),
    reason: text,
    clue: text,
    trap: text,
    elimination: text,
    anchor: text,
    hint: text,
    source: text,
    page: z.number().int().positive(),
    sourceStatus: status,
    difficulty: z.number().min(0).max(5),
    relevance: z.number().min(0).max(5),
    teaching: z.array(teachingSchema).length(4).optional(),
  })
  .strict()
  .superRefine((q, ctx) => {
    const distinct = new Set(q.options.map((o) => normalize(o.text)));
    if (distinct.size !== 4)
      ctx.addIssue({
        code: "custom",
        message: "All four options must have distinct text",
        path: ["options"],
      });
  });

export const sourceSchema = z
  .object({
    id,
    title: text,
    exam: z.string().max(200).nullable(),
    body: text,
    state: z.string().max(200).nullable(),
    year: z.number().int().min(1900).max(2200).nullable(),
    paper: z.string().max(500).nullable(),
    stage: z.string().max(200).nullable(),
    language: text,
    type: z.enum([
      "official_report",
      "official_question_paper",
      "official_answer_key",
      "official_notification",
      "secondary_material",
      "memory_based",
      "authored_practice",
    ]),
    official: z.boolean(),
    url: z.url().nullable(),
    downloadPath: z.string().max(1000).nullable(),
    verification: z.enum([
      "registered",
      "local_copy_inspected",
      "verified",
      "needs_review",
    ]),
    answerKeyStatus: z.enum([
      "not_applicable",
      "missing",
      "unverified",
      "verified",
    ]),
    ocrStatus: z.enum([
      "not_needed",
      "not_started",
      "pending_review",
      "reviewed",
    ]),
    extractionStatus: z.enum([
      "not_started",
      "partial",
      "extracted",
      "reviewed",
    ]),
    questionCount: z.number().int().nonnegative().nullable(),
    relevantCount: z.number().int().nonnegative().nullable(),
    checksum: z
      .string()
      .regex(/^[a-f0-9]{64}$/i)
      .nullable(),
    duplicateGroup: z.string().max(200).nullable(),
    notes: text,
    lastVerified: z.string().datetime().nullable(),
  })
  .strict();
export type CorpusSource = z.infer<typeof sourceSchema>;

const reviewSchema = z
  .object({
    actor: text.max(200),
    reason: text.max(2000),
    reviewerKind: z.literal("human"),
    checks: z
      .object({
        fact: z.literal(true),
        answer: z.literal(true),
        distractors: z.literal(true),
        source: z.literal(true),
        model: z.literal(true),
        duplicate: z.literal(true),
        language: z.literal(true),
        ambiguity: z.literal(true),
      })
      .strict(),
  })
  .strict();
export type PublicationReview = z.infer<typeof reviewSchema>;

function normalize(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("en-IN")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/** Answer text (not option position) participates, so reordered options deduplicate. */
export function questionFingerprint(
  q: Pick<Question, "prompt" | "options" | "answer">,
) {
  const answer = q.options[q.answer]?.text;
  if (!answer) throw new Error("Question has no valid correct option");
  return createHash("sha256")
    .update(
      JSON.stringify({
        stem: normalize(q.prompt),
        options: q.options.map((o) => normalize(o.text)).sort(),
        answer: normalize(answer),
      }),
    )
    .digest("hex");
}

function transaction<T>(db: DatabaseSync, operation: () => T): T {
  // A savepoint works both on its own and during a caller's learner transaction.
  const savepoint = `corpus_${crypto.randomUUID().replaceAll("-", "")}`;
  db.exec(`SAVEPOINT ${savepoint}`);
  try {
    const result = operation();
    db.exec(`RELEASE SAVEPOINT ${savepoint}`);
    return result;
  } catch (error) {
    db.exec(
      `ROLLBACK TO SAVEPOINT ${savepoint}; RELEASE SAVEPOINT ${savepoint}`,
    );
    throw error;
  }
}

export function initializeCorpus(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS corpus_migrations(version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS corpus_sources(id TEXT PRIMARY KEY, metadata TEXT NOT NULL, checksum TEXT, updated_at TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS corpus_sources_checksum ON corpus_sources(checksum);
    CREATE TABLE IF NOT EXISTS corpus_questions(
      id TEXT PRIMARY KEY, current_version INTEGER NOT NULL, published_version INTEGER,
      topic_id TEXT NOT NULL, model_id TEXT NOT NULL, stage TEXT NOT NULL,
      source_status TEXT NOT NULL, search_text TEXT NOT NULL, created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS corpus_published_topic ON corpus_questions(published_version,topic_id,model_id);
    CREATE TABLE IF NOT EXISTS corpus_question_versions(
      question_id TEXT NOT NULL REFERENCES corpus_questions(id), version INTEGER NOT NULL,
      content TEXT NOT NULL, fingerprint TEXT NOT NULL,
      actor TEXT NOT NULL, reason TEXT NOT NULL, created_at TEXT NOT NULL,
      PRIMARY KEY(question_id,version)
    );
    CREATE TABLE IF NOT EXISTS corpus_fingerprints(
      fingerprint TEXT PRIMARY KEY, canonical_id TEXT NOT NULL REFERENCES corpus_questions(id)
    );
    CREATE TABLE IF NOT EXISTS corpus_question_sources(
      question_id TEXT NOT NULL, version INTEGER NOT NULL,
      source_id TEXT NOT NULL REFERENCES corpus_sources(id),
      PRIMARY KEY(question_id,version,source_id),
      FOREIGN KEY(question_id,version) REFERENCES corpus_question_versions(question_id,version)
    );
    CREATE TABLE IF NOT EXISTS corpus_reviews(
      id INTEGER PRIMARY KEY, question_id TEXT NOT NULL, version INTEGER NOT NULL,
      decision TEXT NOT NULL CHECK(decision IN ('published','seed_preserved','rejected')),
      actor TEXT NOT NULL, reason TEXT NOT NULL, review TEXT NOT NULL, created_at TEXT NOT NULL,
      FOREIGN KEY(question_id,version) REFERENCES corpus_question_versions(question_id,version)
    );
    CREATE TABLE IF NOT EXISTS corpus_import_audit(
      id INTEGER PRIMARY KEY, incoming_id TEXT NOT NULL, canonical_id TEXT NOT NULL,
      outcome TEXT NOT NULL, actor TEXT NOT NULL, reason TEXT NOT NULL, created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS corpus_source_audit(
      id INTEGER PRIMARY KEY, source_id TEXT NOT NULL, metadata TEXT NOT NULL,
      actor TEXT NOT NULL, reason TEXT NOT NULL, created_at TEXT NOT NULL
    );
    CREATE TRIGGER IF NOT EXISTS corpus_version_immutable_update BEFORE UPDATE ON corpus_question_versions
      BEGIN SELECT RAISE(ABORT,'Question versions are immutable; create a new version'); END;
    CREATE TRIGGER IF NOT EXISTS corpus_version_immutable_delete BEFORE DELETE ON corpus_question_versions
      BEGIN SELECT RAISE(ABORT,'Question versions are immutable; preserve attempt history'); END;
    INSERT OR IGNORE INTO corpus_migrations VALUES(1,strftime('%Y-%m-%dT%H:%M:%fZ','now'));
  `);
}

function registerSource(
  db: DatabaseSync,
  source: CorpusSource,
  actor: string,
  reason: string,
) {
  const now = new Date().toISOString();
  const metadata = JSON.stringify(source);
  const existing = db
    .prepare("SELECT metadata FROM corpus_sources WHERE id=?")
    .get(source.id) as { metadata: string } | undefined;
  if (existing?.metadata === metadata) return;
  db.prepare(
    "INSERT INTO corpus_sources VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET metadata=excluded.metadata,checksum=excluded.checksum,updated_at=excluded.updated_at",
  ).run(source.id, metadata, source.checksum, now);
  db.prepare(
    "INSERT INTO corpus_source_audit(source_id,metadata,actor,reason,created_at) VALUES(?,?,?,?,?)",
  ).run(source.id, metadata, actor, reason, now);
}

function sourceExists(db: DatabaseSync, sourceId: string) {
  return Boolean(
    db.prepare("SELECT 1 FROM corpus_sources WHERE id=?").get(sourceId),
  );
}

type WriteResult = {
  id: string;
  version: number;
  outcome: "created" | "revised" | "duplicate" | "unchanged";
};
function writeQuestion(
  db: DatabaseSync,
  question: Question,
  sourceIds: string[],
  actor: string,
  reason: string,
): WriteResult {
  const fingerprint = questionFingerprint(question);
  const content = JSON.stringify(question);
  const duplicate = db
    .prepare("SELECT canonical_id FROM corpus_fingerprints WHERE fingerprint=?")
    .get(fingerprint) as { canonical_id: string } | undefined;
  const canonical = duplicate?.canonical_id ?? question.id;
  const current = db
    .prepare("SELECT current_version FROM corpus_questions WHERE id=?")
    .get(canonical) as { current_version: number } | undefined;
  const now = new Date().toISOString();
  let version = current?.current_version ?? 0;
  let outcome: WriteResult["outcome"];
  if (duplicate && canonical !== question.id) {
    outcome = "duplicate";
  } else {
    const existing = current
      ? (db
          .prepare(
            "SELECT content FROM corpus_question_versions WHERE question_id=? AND version=?",
          )
          .get(canonical, version) as { content: string })
      : null;
    if (existing?.content === content) {
      outcome = "unchanged";
    } else {
      version += 1;
      outcome = current ? "revised" : "created";
      // Search/filter columns describe the currently published revision once one exists.
      db.prepare(
        `INSERT INTO corpus_questions VALUES(?,?,NULL,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET current_version=excluded.current_version`,
      ).run(
        canonical,
        version,
        question.topic,
        question.modelId,
        question.stage,
        question.sourceStatus,
        normalize(question.prompt),
        now,
      );
      db.prepare(
        "INSERT INTO corpus_question_versions VALUES(?,?,?,?,?,?,?)",
      ).run(canonical, version, content, fingerprint, actor, reason, now);
      db.prepare("INSERT OR IGNORE INTO corpus_fingerprints VALUES(?,?)").run(
        fingerprint,
        canonical,
      );
    }
  }
  for (const sourceId of new Set(sourceIds)) {
    if (!sourceExists(db, sourceId))
      throw new Error(`Unknown source: ${sourceId}`);
    db.prepare(
      "INSERT OR IGNORE INTO corpus_question_sources VALUES(?,?,?)",
    ).run(canonical, version, sourceId);
  }
  db.prepare(
    "INSERT INTO corpus_import_audit(incoming_id,canonical_id,outcome,actor,reason,created_at) VALUES(?,?,?,?,?,?)",
  ).run(question.id, canonical, outcome, actor, reason, now);
  return { id: canonical, version, outcome };
}

const importSchema = z
  .object({
    actor: text.max(200),
    reason: text.max(2000),
    sources: z.array(sourceSchema).max(100).default([]),
    questions: z
      .array(
        z
          .object({
            question: questionSchema,
            sourceIds: z.array(id).min(1).max(20),
          })
          .strict(),
      )
      .min(1)
      .max(10000),
  })
  .strict();

/** All new imports are pending review. A revision leaves the last published version live. */
export function importCorpus(db: DatabaseSync, input: unknown) {
  const parsed = importSchema.parse(input);
  return transaction(db, () => {
    for (const source of parsed.sources)
      registerSource(db, source, parsed.actor, parsed.reason);
    return parsed.questions.map(({ question, sourceIds }) =>
      writeQuestion(
        db,
        question as Question,
        sourceIds,
        parsed.actor,
        parsed.reason,
      ),
    );
  });
}

function publishPointer(db: DatabaseSync, question: Question, version: number) {
  db.prepare(
    "UPDATE corpus_questions SET published_version=?,topic_id=?,model_id=?,stage=?,source_status=?,search_text=? WHERE id=?",
  ).run(
    version,
    question.topic,
    question.modelId,
    question.stage,
    question.sourceStatus,
    normalize(`${question.prompt} ${question.model} ${question.reason}`),
    question.id,
  );
}

/** The CLI requires an explicit review document; imports/model output cannot self-publish. */
export function publishCorpusQuestion(
  db: DatabaseSync,
  questionId: string,
  version: number,
  reviewInput: PublicationReview,
) {
  const review = reviewSchema.parse(reviewInput);
  id.parse(questionId);
  z.number().int().positive().parse(version);
  return transaction(db, () => {
    const row = db
      .prepare(
        "SELECT content FROM corpus_question_versions WHERE question_id=? AND version=?",
      )
      .get(questionId, version) as { content: string } | undefined;
    if (!row) throw new Error("Question version not found");
    const question = JSON.parse(row.content) as Question;
    if (!question.teaching)
      throw new Error(
        "Publication requires teacher explanations for all four options in this question version",
      );
    if (
      ![
        "GENERATED PRACTICE QUESTION",
        "EXPECTED PRACTICE QUESTION",
        "VERIFIED PYQ",
      ].includes(question.sourceStatus)
    )
      throw new Error(
        "Questions with an unverified answer key must remain outside scored practice",
      );
    const sources = db
      .prepare(
        "SELECT s.metadata FROM corpus_sources s JOIN corpus_question_sources qs ON qs.source_id=s.id WHERE qs.question_id=? AND qs.version=?",
      )
      .all(questionId, version) as { metadata: string }[];
    if (!sources.length)
      throw new Error("Publication requires a registered source");
    if ((question.sourceStatus as string) === "VERIFIED PYQ") {
      const parsedSources = sources.map(
        (s) => JSON.parse(s.metadata) as CorpusSource,
      );
      if (
        !parsedSources.some(
          (s) =>
            s.type === "official_question_paper" &&
            s.official &&
            s.verification === "verified",
        ) ||
        !parsedSources.some(
          (s) =>
            s.answerKeyStatus === "verified" &&
            s.official &&
            s.verification === "verified",
        )
      ) {
        throw new Error(
          "Verified PYQ publication requires a verified official paper and answer key",
        );
      }
    }
    db.prepare(
      "INSERT INTO corpus_reviews(question_id,version,decision,actor,reason,review,created_at) VALUES(?,?,'published',?,?,?,?)",
    ).run(
      questionId,
      version,
      review.actor,
      review.reason,
      JSON.stringify(review),
      new Date().toISOString(),
    );
    publishPointer(db, question, version);
    return { id: questionId, version, status: "published" as const };
  });
}

const reportSource: CorpusSource = {
  id: "SR-HIST-SRIKRISHNA-2010",
  title:
    "Committee for Consultations on the Situation in Andhra Pradesh — report (2010)",
  exam: null,
  body: "Ministry of Home Affairs / Srikrishna Committee",
  state: "Andhra Pradesh (undivided)",
  year: 2010,
  paper: null,
  stage: null,
  language: "English",
  type: "official_report",
  official: true,
  url: "https://www.mha.gov.in/sites/default/files/CCSAP-REPORT-060111.pdf",
  downloadPath: "../sources/Srikrishna_Committee_Report_2010.pdf",
  verification: "local_copy_inspected",
  answerKeyStatus: "not_applicable",
  ocrStatus: "not_needed",
  extractionStatus: "partial",
  questionCount: null,
  relevantCount: null,
  checksum: "f05de3efbb858e2fd8178b8662f8dfe19026cfb6d2aef93d0575ba1055278f91",
  duplicateGroup: null,
  notes:
    "Local report passages checked for the ten existing authored practice items. This is factual support, not an examination paper or official answer key. Initial corpus migration preserves existing practice; independent publication review remains outstanding.",
  lastVerified: null,
};

/** Preserve legacy seed once. Future source-file edits must use an explicit versioned import. */
export function seedCorpus(db: DatabaseSync, questions: Question[]) {
  return transaction(db, () => {
    if (!sourceExists(db, reportSource.id))
      registerSource(
        db,
        reportSource,
        "migration:existing-app",
        "Register factual source for pre-existing authored practice; no PYQ claim",
      );
    let created = 0;
    for (const input of questions) {
      if (db.prepare("SELECT 1 FROM corpus_questions WHERE id=?").get(input.id))
        continue;
      const seedInput = hasAuthoredTeaching(input)
        ? {
            ...input,
            teaching: input.options.map((_, i) => getTeaching(input, i)),
          }
        : input;
      const question = questionSchema.parse(seedInput) as Question;
      const result = writeQuestion(
        db,
        question,
        [reportSource.id],
        "migration:existing-app",
        "Preserve pre-existing generated practice as version 1 without claiming independent human review",
      );
      if (result.outcome !== "created") continue;
      db.prepare(
        "INSERT INTO corpus_reviews(question_id,version,decision,actor,reason,review,created_at) VALUES(?,?,'seed_preserved',?,?,?,?)",
      ).run(
        result.id,
        result.version,
        "migration:existing-app",
        "Existing authored practice preserved; independent publication review outstanding",
        JSON.stringify({ independentlyReviewed: false, migrationOnly: true }),
        new Date().toISOString(),
      );
      publishPointer(db, question, result.version);
      created += 1;
    }
    return { created };
  });
}

export function getCorpusQuestion(
  db: DatabaseSync,
  questionId: string,
  version?: number,
): VersionedQuestion | null {
  if (version !== undefined && (!Number.isInteger(version) || version < 1))
    throw new Error("Invalid question version");
  const row =
    version === undefined
      ? db
          .prepare(
            "SELECT v.content,v.version FROM corpus_questions q JOIN corpus_question_versions v ON v.question_id=q.id AND v.version=q.published_version WHERE q.id=?",
          )
          .get(questionId)
      : db
          .prepare(
            "SELECT v.content,v.version FROM corpus_question_versions v WHERE v.question_id=? AND v.version=? AND EXISTS(SELECT 1 FROM corpus_reviews r WHERE r.question_id=v.question_id AND r.version=v.version AND r.decision IN ('published','seed_preserved'))",
          )
          .get(questionId, version);
  const result = row as { content: string; version: number } | undefined;
  return result
    ? { ...JSON.parse(result.content), version: result.version }
    : null;
}

export type CorpusFilters = {
  topic?: string;
  modelId?: string;
  stage?: string;
  query?: string;
  sourceStatus?: string;
  ids?: string[];
  excludeIds?: string[];
  limit?: number;
  offset?: number;
};
export function listCorpusQuestions(
  db: DatabaseSync,
  filters: CorpusFilters = {},
) {
  const limit = Number.isFinite(filters.limit)
    ? Math.min(50, Math.max(1, Math.floor(filters.limit!)))
    : 20;
  const offset = Number.isFinite(filters.offset)
    ? Math.max(0, Math.floor(filters.offset!))
    : 0;
  const clauses = ["q.published_version IS NOT NULL"];
  const values: (string | number)[] = [];
  for (const [column, value] of [
    ["topic_id", filters.topic],
    ["model_id", filters.modelId],
    ["stage", filters.stage],
    ["source_status", filters.sourceStatus],
  ] as const) {
    if (value !== undefined) {
      clauses.push(`q.${column}=?`);
      values.push(value);
    }
  }
  if (filters.query) {
    if (filters.query.length > 500) throw new Error("Search query is too long");
    clauses.push("q.search_text LIKE ? ESCAPE '\\'");
    values.push(`%${normalize(filters.query).replace(/[\\%_]/g, "\\$&")}%`);
  }
  for (const [ids, excluded] of [
    [filters.ids, false],
    [filters.excludeIds, true],
  ] as const) {
    if (!ids) continue;
    if (ids.length > 500)
      throw new Error("At most 500 question IDs may be filtered at once");
    if (!ids.length) {
      if (!excluded) clauses.push("0=1");
      continue;
    }
    clauses.push(
      `q.id ${excluded ? "NOT IN" : "IN"} (${ids.map(() => "?").join(",")})`,
    );
    values.push(...ids);
  }
  const where = clauses.join(" AND ");
  const total = (
    db
      .prepare(`SELECT count(*) AS n FROM corpus_questions q WHERE ${where}`)
      .get(...values) as { n: number }
  ).n;
  const rows = db
    .prepare(
      `SELECT v.content,v.version FROM corpus_questions q JOIN corpus_question_versions v ON v.question_id=q.id AND v.version=q.published_version WHERE ${where} ORDER BY q.id LIMIT ? OFFSET ?`,
    )
    .all(...values, limit, offset) as { content: string; version: number }[];
  return {
    items: rows.map(
      (r) =>
        ({ ...JSON.parse(r.content), version: r.version }) as VersionedQuestion,
    ),
    total,
    limit,
    offset,
  };
}

export function listCorpusSources(
  db: DatabaseSync,
  limit = 20,
  offset = 0,
): CorpusSource[] {
  const safeLimit = Number.isFinite(limit)
    ? Math.min(50, Math.max(1, Math.floor(limit)))
    : 20;
  const safeOffset = Number.isFinite(offset)
    ? Math.max(0, Math.floor(offset))
    : 0;
  return (
    db
      .prepare(
        "SELECT metadata FROM corpus_sources ORDER BY id LIMIT ? OFFSET ?",
      )
      .all(safeLimit, safeOffset) as { metadata: string }[]
  ).map((r) => JSON.parse(r.metadata));
}

export function corpusSummary(db: DatabaseSync) {
  const count = (sql: string) => (db.prepare(sql).get() as { n: number }).n;
  const statuses = db
    .prepare(
      "SELECT source_status AS status,count(*) AS count FROM corpus_questions WHERE published_version IS NOT NULL GROUP BY source_status ORDER BY source_status",
    )
    .all() as { status: string; count: number }[];
  return {
    total: count("SELECT count(*) AS n FROM corpus_questions"),
    published: count(
      "SELECT count(*) AS n FROM corpus_questions WHERE published_version IS NOT NULL",
    ),
    pendingReview: count(
      "SELECT count(*) AS n FROM corpus_questions WHERE published_version IS NULL OR current_version<>published_version",
    ),
    versions: count("SELECT count(*) AS n FROM corpus_question_versions"),
    sources: count("SELECT count(*) AS n FROM corpus_sources"),
    independentlyReviewed: count(
      "SELECT count(*) AS n FROM corpus_questions q WHERE EXISTS(SELECT 1 FROM corpus_reviews r WHERE r.question_id=q.id AND r.version=q.published_version AND r.decision='published')",
    ),
    statuses: statuses.map((s) => ({ ...s })),
  };
}

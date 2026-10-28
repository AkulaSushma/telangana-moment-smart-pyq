import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { performance } from "node:perf_hooks";
import { questions } from "../lib/content";
import { getTeaching } from "../lib/teaching";
import {
  corpusSummary,
  getCorpusQuestion,
  importCorpus,
  initializeCorpus,
  listCorpusQuestions,
  listCorpusSources,
  publishCorpusQuestion,
  questionFingerprint,
  seedCorpus,
  type PublicationReview,
} from "../lib/corpus";

const sourceId = "SR-HIST-SRIKRISHNA-2010";
const review: PublicationReview = {
  actor: "test:human-review-fixture",
  reason: "Synthetic test only: verify publication gating",
  reviewerKind: "human",
  checks: {
    fact: true,
    answer: true,
    distractors: true,
    source: true,
    model: true,
    duplicate: true,
    language: true,
    ambiguity: true,
  },
};
function database() {
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys=ON");
  initializeCorpus(db);
  seedCorpus(db, questions);
  return db;
}
function staged(question: (typeof questions)[number]) {
  const teaching = questions[0].options.map((_, i) =>
    getTeaching(questions[0], i),
  );
  return {
    actor: "test:fixture",
    reason: "Synthetic test content; never production corpus",
    questions: [{ question: { ...question, teaching }, sourceIds: [sourceId] }],
  };
}

test("corpus seeding preserves content and registers factual support without claiming reviewed PYQs", () => {
  const db = database();
  try {
    assert.equal(corpusSummary(db).published, 10);
    assert.equal(corpusSummary(db).independentlyReviewed, 0);
    assert.deepEqual(corpusSummary(db).statuses, [
      { status: "GENERATED PRACTICE QUESTION", count: 10 },
    ]);
    assert.equal(listCorpusSources(db)[0].answerKeyStatus, "not_applicable");
    assert.match(listCorpusSources(db)[0].checksum!, /^[a-f0-9]{64}$/);
    const changed = { ...questions[0], answer: 0 };
    seedCorpus(db, [changed]);
    assert.equal(
      getCorpusQuestion(db, changed.id)!.answer,
      questions[0].answer,
    );
    assert.equal(corpusSummary(db).versions, 10);
    initializeCorpus(db);
    assert.equal(corpusSummary(db).total, 10);
  } finally {
    db.close();
  }
});

test("canonical fingerprints deduplicate reordered options and retain source relationship", () => {
  const db = database();
  try {
    const base = questions[0];
    const reordered = {
      ...base,
      id: "DUPLICATE-TEST",
      options: [...base.options].reverse(),
      answer: 3 - base.answer,
    };
    assert.equal(questionFingerprint(base), questionFingerprint(reordered));
    const result = importCorpus(db, staged(reordered));
    assert.deepEqual(result, [
      { id: base.id, version: 1, outcome: "duplicate" },
    ]);
    assert.equal(corpusSummary(db).total, 10);
    assert.equal(getCorpusQuestion(db, reordered.id), null);
    assert.equal(
      (
        db
          .prepare(
            "SELECT count(*) AS n FROM corpus_question_sources WHERE question_id=?",
          )
          .get(base.id) as { n: number }
      ).n,
      1,
    );
  } finally {
    db.close();
  }
});

test("answer and explanation revisions are immutable, staged, and explicit publication preserves old scoring", () => {
  const db = database();
  try {
    const base = questions[0];
    const revised = {
      ...base,
      answer: 0,
      reason: "Synthetic changed-answer fixture; not historical content",
    };
    assert.deepEqual(importCorpus(db, staged(revised)), [
      { id: base.id, version: 2, outcome: "revised" },
    ]);
    assert.equal(getCorpusQuestion(db, base.id)!.version, 1);
    assert.equal(getCorpusQuestion(db, base.id, 2), null);
    assert.equal(corpusSummary(db).pendingReview, 1);
    assert.throws(() =>
      publishCorpusQuestion(db, base.id, 2, {
        ...review,
        reviewerKind: "model",
      } as unknown as PublicationReview),
    );
    publishCorpusQuestion(db, base.id, 2, review);
    assert.equal(getCorpusQuestion(db, base.id)!.answer, 0);
    assert.equal(getCorpusQuestion(db, base.id, 1)!.answer, base.answer);
    assert.equal(getCorpusQuestion(db, base.id, 1)!.reason, base.reason);
    assert.equal(corpusSummary(db).independentlyReviewed, 1);
    assert.throws(
      () =>
        db
          .prepare(
            "UPDATE corpus_question_versions SET content='{}' WHERE question_id=?",
          )
          .run(base.id),
      /immutable/,
    );
    assert.throws(
      () =>
        db
          .prepare("DELETE FROM corpus_question_versions WHERE question_id=?")
          .run(base.id),
      /immutable/,
    );
  } finally {
    db.close();
  }
});

test("imports reject unknown sources, invalid options and publication flags atomically", () => {
  const db = database();
  try {
    const fresh = {
      ...questions[0],
      id: "IMPORT-INVALID",
      prompt: "Synthetic new prompt",
    };
    const invalidSource = staged(fresh);
    invalidSource.questions[0].sourceIds = ["MISSING-SOURCE"];
    assert.throws(() => importCorpus(db, invalidSource), /Unknown source/);
    assert.equal(corpusSummary(db).total, 10);
    assert.throws(() =>
      importCorpus(db, { ...staged(fresh), published: true }),
    );
    assert.throws(() =>
      importCorpus(
        db,
        staged({
          ...fresh,
          options: [
            fresh.options[0],
            fresh.options[0],
            fresh.options[2],
            fresh.options[3],
          ],
        }),
      ),
    );
    assert.equal(corpusSummary(db).total, 10);
  } finally {
    db.close();
  }
});

test("verified PYQ label cannot publish against report-only evidence", () => {
  const db = database();
  try {
    const input = staged({
      ...questions[0],
      id: "FALSE-PYQ",
      prompt: "Synthetic provenance guard question",
    });
    (input.questions[0].question as { sourceStatus: string }).sourceStatus =
      "VERIFIED PYQ";
    importCorpus(db, input);
    assert.throws(
      () => publishCorpusQuestion(db, "FALSE-PYQ", 1, review),
      /verified official paper and answer key/,
    );
    assert.equal(getCorpusQuestion(db, "FALSE-PYQ"), null);
  } finally {
    db.close();
  }
});

test("published retrieval is bounded, filterable and treats wildcard input as literal text", () => {
  const db = database();
  try {
    const result = listCorpusQuestions(db, { limit: 10000, offset: 0 });
    assert.equal(result.limit, 50);
    assert.equal(result.total, 10);
    assert.equal(
      listCorpusQuestions(db, { limit: 3, offset: 9 }).items.length,
      1,
    );
    assert.equal(listCorpusQuestions(db, { ids: [] }).items.length, 0);
    assert.equal(
      listCorpusQuestions(db, {
        ids: [questions[0].id, questions[1].id],
        excludeIds: [questions[0].id],
      }).items[0].id,
      questions[1].id,
    );
    assert.equal(listCorpusQuestions(db, { query: "%" }).total, 0);
    assert.ok(listCorpusQuestions(db, { query: "university" }).total > 0);
    assert.ok(
      listCorpusQuestions(db, { stage: "recall" }).items.every(
        (q) => q.stage === "recall",
      ),
    );
    assert.throws(
      () => listCorpusQuestions(db, { ids: new Array(501).fill("x") }),
      /500/,
    );
  } finally {
    db.close();
  }
});

test("publication refuses missing teacher explanations and unverified-key classifications", () => {
  const db = database();
  try {
    const q = {
      ...questions[0],
      id: "TEACHER-MISSING",
      prompt: "Synthetic unpublished teacher fixture",
    };
    importCorpus(db, {
      actor: "test",
      reason: "Publication gate test",
      questions: [{ question: q, sourceIds: [sourceId] }],
    });
    assert.throws(
      () => publishCorpusQuestion(db, q.id, 1, review),
      /teacher explanations/,
    );
    const unverified = {
      ...q,
      id: "UNVERIFIED-KEY",
      prompt: "Synthetic unverified key fixture",
      sourceStatus: "VERIFIED QUESTION TEXT — KEY UNVERIFIED" as const,
    };
    importCorpus(db, staged(unverified));
    assert.throws(
      () => publishCorpusQuestion(db, unverified.id, 1, review),
      /unverified answer key/,
    );
    assert.equal(listCorpusQuestions(db).total, 10);
  } finally {
    db.close();
  }
});

test("10,000 synthetic items verify storage and bounded retrieval; they are NOT a real verified corpus", (t) => {
  const db = database();
  try {
    const start = performance.now();
    const fixture = Array.from({ length: 10000 }, (_, i) => ({
      question: {
        ...questions[0],
        teaching: questions[0].options.map((_, j) =>
          getTeaching(questions[0], j),
        ),
        id: `SYNTHETIC-${String(i).padStart(5, "0")}`,
        prompt: `SYNTHETIC SCALE FIXTURE ${i}: not study content`,
      },
      sourceIds: [sourceId],
    }));
    const results = importCorpus(db, {
      actor: "test:scale-fixture",
      reason: "In-memory synthetic scale test only",
      questions: fixture,
    });
    assert.equal(results.length, 10000);
    assert.equal(corpusSummary(db).pendingReview, 10000);
    assert.equal(listCorpusQuestions(db).total, 10);
    // Test publication at scale with explicit fixture reviews, then exercise final page retrieval.
    db.exec("BEGIN");
    for (const result of results)
      publishCorpusQuestion(db, result.id, result.version, review);
    db.exec("COMMIT");
    const page = listCorpusQuestions(db, { limit: 50, offset: 9950 });
    assert.equal(page.total, 10010);
    assert.equal(page.items.length, 50);
    assert.equal(new Set(page.items.map((q) => q.id)).size, 50);
    assert.equal(getCorpusQuestion(db, "SYNTHETIC-09999")!.version, 1);
    t.diagnostic(
      `Synthetic import, explicit fixture publication and retrieval completed in ${Math.round(performance.now() - start)} ms. Database destroyed after test.`,
    );
  } finally {
    db.close();
  }
});

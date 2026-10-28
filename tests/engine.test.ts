import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createLearner,
  startSession,
  recordAttempt,
  recommendation,
  stats,
  log,
  type Learner,
  type Attempt,
} from "../lib/engine";
import { questions } from "../lib/content";
const now = 1790812800000;
function answer(s: Learner, correct = true, hint = false, at = now): Attempt {
  const ss = s.session!;
  const q = questions.find((q) => q.id === ss.queue[ss.index])!;
  return {
    id: crypto.randomUUID(),
    questionId: q.id,
    selected: correct ? q.answer : (q.answer + 1) % 4,
    correct,
    confidence: 85,
    seconds: 25,
    recognitionSeconds: 10,
    changes: 0,
    hint,
    at,
    sessionId: ss.id,
    demo: false,
  };
}
test("fresh learner has no invented mastery or retention", () => {
  const s = createLearner("fresh", false, now);
  assert.equal(stats(s).status, "UNSEEN");
  assert.equal(stats(s).retention, null);
  assert.equal(recommendation(s).kind, "foundation");
});
test("demo evidence generates repair, with actual 40% accuracy", () => {
  const s = createLearner("demo", true, now);
  assert.equal(stats(s).accuracy, 40);
  assert.equal(stats(s).confusion, 2);
  assert.equal(recommendation(s).kind, "repair");
  assert.equal(s.attempts.filter((a) => a.questionId === "TM-Q001").length, 2);
});
test("plan contains 3 recognition, 5 application, 1 rewording; recall remains delayed", () => {
  const s = startSession(createLearner("plan", false, now), "repair", now);
  const stages = s.session!.queue.map(
    (id) => questions.find((q) => q.id === id)!.stage,
  );
  assert.equal(stages.filter((x) => x === "recognition").length, 3);
  assert.equal(stages.filter((x) => x === "practice").length, 5);
  assert.equal(stages.filter((x) => x === "rewording").length, 1);
  assert.ok(!s.session!.queue.includes("TM-Q010"));
});
test("wrong answer creates a short retrieval delay and preserves real result", () => {
  const s = startSession(createLearner("wrong", false, now), "repair", now);
  recordAttempt(s, answer(s, false), now);
  assert.equal(s.attempts.length, 1);
  assert.equal(s.revisions[0].due, now + 15 * 60000);
  assert.equal(s.session!.index, 1);
});
test("same request id is idempotent", () => {
  const s = startSession(createLearner("idem", false, now), "repair", now);
  const a = answer(s);
  recordAttempt(s, a, now);
  recordAttempt(s, a, now);
  assert.equal(s.attempts.length, 1);
  assert.equal(s.session!.index, 1);
});
test("genuine independent improvement changes recommendation and reduces repetition", () => {
  const s = startSession(createLearner("improve", true, now), "repair", now);
  for (let i = 0; i < 9; i++)
    recordAttempt(s, answer(s, true, false, now + i * 30000), now + i * 30000);
  assert.equal(stats(s).improved, true);
  assert.equal(stats(s).stable, false);
  assert.equal(stats(s).recent, 100);
  assert.equal(s.session!.completed, true);
  assert.equal(recommendation(s, now + 200000).kind, "space");
  assert.equal(recommendation(s, s.revisions[0].due + 1).kind, "recall");
});
test("six hints do not qualify as independent improvement", () => {
  const s = startSession(createLearner("hinted", true, now), "repair", now);
  for (let i = 0; i < 6; i++) recordAttempt(s, answer(s, true, true), now);
  assert.equal(stats(s).improved, false);
  assert.equal(s.revisions[0].intervalDays, 0);
});
test("early recall cannot inflate the spacing interval", () => {
  const s = startSession(createLearner("early", false, now), "recall", now);
  s.revisions = [
    {
      questionId: "TM-Q010",
      due: now + 86400000,
      intervalDays: 4,
      reason: "test",
    },
  ];
  recordAttempt(s, answer(s), now);
  assert.equal(s.revisions[0].intervalDays, 1);
});
test("due recall expands the interval; wrong recall resets it", () => {
  const s = startSession(createLearner("due", false, now), "recall", now);
  s.revisions = [
    { questionId: "TM-Q010", due: now - 1, intervalDays: 2, reason: "test" },
  ];
  recordAttempt(s, answer(s), now);
  assert.equal(s.revisions[0].intervalDays, 4);
  startSession(s, "recall", now + 1);
  recordAttempt(s, answer(s, false), now + 1);
  assert.equal(s.revisions[0].intervalDays, 0);
});
test("model accuracy is separate from overall accuracy", () => {
  const s = createLearner("model", true, now);
  assert.equal(
    stats(s).models.find((m) => m.model === "Statements")!.accuracy,
    0,
  );
  assert.equal(
    stats(s).models.find((m) => m.model === "Provision identification")!
      .accuracy,
    100,
  );
});
test("wrong application changes remaining sequence to another matching model", () => {
  const s = startSession(createLearner("reorder", false, now), "repair", now);
  s.session!.index = 3;
  recordAttempt(s, answer(s, false), now);
  assert.equal(s.session!.queue[4], "TM-Q008");
});
test("all scored items have source, rationale, distinct options and honest classification", () => {
  for (const q of questions) {
    assert.equal(q.sourceStatus, "GENERATED PRACTICE QUESTION");
    assert.ok(q.options[q.answer]);
    assert.equal(new Set(q.options.map((o) => o.text)).size, 4);
    assert.ok(q.reason && q.source && q.trap && q.anchor && q.modelId);
    assert.ok(q.options.every((o) => o.why && o.attraction));
  }
});
test("event window is bounded but IDs remain unique", () => {
  const s = createLearner("events", false, now);
  for (let i = 0; i < 1005; i++)
    log(s, "question_viewed", "TM-Q001", undefined, now + i);
  assert.equal(s.events.length, 1000);
  assert.equal(new Set(s.events.map((e) => e.id)).size, 1000);
});
test("an early recall does not invent retention; a delayed failure reports 0%", () => {
  const s = startSession(createLearner("retention", false, now), "repair", now);
  recordAttempt(s, answer(s), now);
  startSession(s, "recall", now + 1000);
  recordAttempt(s, answer(s, true, false, now + 1000), now + 1000);
  assert.equal(stats(s).retention, null);
  startSession(s, "recall", now + 86400000);
  recordAttempt(s, answer(s, false, false, now + 86400000), now + 86400000);
  assert.equal(stats(s).retention, 0);
});

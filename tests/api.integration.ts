import { test } from "node:test";
import assert from "node:assert/strict";
import { questions } from "../lib/content";
const url = process.env.TEST_URL || "http://127.0.0.1:3000";
test("API validates, isolates, scores, deduplicates and persists a full repair session", async () => {
  const initial = await fetch(`${url}/api/learning`);
  assert.equal(initial.status, 200);
  const cookie = initial.headers.get("set-cookie")!.split(";")[0];
  const post = async (payload: unknown) => {
    const r = await fetch(`${url}/api/learning`, {
      method: "POST",
      headers: { "Content-Type": "application/json", cookie },
      body: JSON.stringify(payload),
    });
    return { status: r.status, data: await r.json() };
  };
  assert.equal((await post({ action: "answer", selected: 5 })).status, 400);
  const start = await post({ action: "start", kind: "repair" });
  assert.equal(start.status, 200);
  let state = start.data;
  for (let i = 0; i < 9; i++) {
    const ss = state.learner.session;
    const payload = {
      action: "answer",
      id: crypto.randomUUID(),
      sessionId: ss.id,
      questionId: ss.queue[ss.index],
      selected: (
        state.questions.find((q: any) => q.id === ss.queue[ss.index]) ||
        questions.find((q) => q.id === ss.queue[ss.index])
      )!.answer,
      confidence: 85,
      seconds: 25,
      recognitionSeconds: 10,
      changes: 0,
      hint: false,
    };
    const response = await post(payload);
    assert.equal(response.status, 200);
    state = response.data;
    if (i === 0) {
      const retry = await post(payload);
      assert.equal(retry.data.learner.attempts.length, 6);
      assert.equal(retry.data.learner.session.index, 1);
    }
  }
  assert.equal(state.stats.improved, true);
  assert.equal(state.recommendation.kind, "space");
  assert.equal(state.learner.session.completed, true);
  const reload = await fetch(`${url}/api/learning`, {
    headers: { cookie },
  }).then((r) => r.json());
  assert.equal(reload.learner.attempts.length, 14);
  assert.equal(reload.recommendation.kind, "space");
  const second = await fetch(`${url}/api/learning`).then((r) => r.json());
  assert.notEqual(second.learner.id, reload.learner.id);
  assert.equal(second.learner.attempts.length, 5);
  const exportData = await fetch(`${url}/api/export`, {
    headers: { cookie },
  }).then((r) => r.json());
  assert.equal(exportData.learner.attempts.length, 14);
  const badOrigin = await fetch(`${url}/api/learning`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie,
      origin: "https://not-this-app.example",
    },
    body: JSON.stringify({ action: "target", target: "SI" }),
  });
  assert.equal(badOrigin.status, 403);
});

test("wrong university answer returns immediate option-specific teaching, version pinning and bounded search", async () => {
  const initial = await fetch(`${url}/api/learning`);
  const cookie = initial.headers.get("set-cookie")!.split(";")[0];
  const post = async (payload: unknown) =>
    fetch(`${url}/api/learning`, {
      method: "POST",
      headers: { "Content-Type": "application/json", cookie },
      body: JSON.stringify(payload),
    });
  let state = await (await post({ action: "start", kind: "repair" })).json();
  let checked = false;
  for (let i = 0; i < 9 && !state.learner.session.completed; i++) {
    const ss = state.learner.session;
    const q = state.questions.find(
      (q: { id: string }) => q.id === ss.queue[ss.index],
    );
    assert.ok(q, "Current version is in the bounded response");
    const payload = {
      action: "answer",
      id: crypto.randomUUID(),
      sessionId: ss.id,
      questionId: q.id,
      questionVersion: q.version,
      selected: q.id === "TM-Q002" ? 0 : q.answer,
      confidence: 85,
      seconds: 20,
      recognitionSeconds: 5,
      changes: 0,
      hint: false,
    };
    if (q.id === "TM-Q002") {
      const stale = await post({ ...payload, questionVersion: 99 });
      assert.equal(stale.status, 409);
    }
    const result = await post(payload);
    assert.equal(result.status, 200);
    state = await result.json();
    if (q.id === "TM-Q002") {
      checked = true;
      const attempt = state.learner.attempts.find(
        (a: { id: string }) => a.id === payload.id,
      );
      assert.equal(attempt.correct, false);
      assert.equal(attempt.questionVersion, 1);
      const feedback = state.questions.find(
        (q: { id: string }) => q.id === "TM-Q002",
      );
      assert.match(feedback.lessons[0].correctMeaning, /Six-Point Formula/);
      assert.match(feedback.lessons[0].selectedMeaning, /government jobs/);
      assert.match(feedback.lessons[0].observation, /Central University/);
      assert.ok(feedback.lessons[0].decisionRules.length >= 2);
      const duplicate = await post(payload);
      assert.equal(
        (await duplicate.json()).learner.attempts.length,
        state.learner.attempts.length,
      );
      break;
    }
  }
  assert.ok(checked, "The university confusion was exercised");
  const page = await fetch(`${url}/api/questions?query=university&limit=1`, {
    headers: { cookie },
  }).then((r) => r.json());
  assert.equal(page.items.length, 1);
  assert.ok(page.total >= 1);
  assert.equal(
    (await fetch(`${url}/api/questions?limit=10000`, { headers: { cookie } }))
      .status,
    400,
  );
  assert.equal((await fetch(`${url}/api/questions`)).status, 401);
  const invalid = await fetch(`${url}/api/learning`, {
    method: "POST",
    headers: { cookie, "Content-Type": "application/json" },
    body: "{",
  });
  assert.equal(invalid.status, 400);
});

import { questions, type Question } from "./content";
export type Attempt = {
  id: string;
  questionId: string;
  questionVersion?: number;
  evidence?: {
    model: Question["model"];
    stage: Question["stage"];
    concept: string;
    selectedConfusion: boolean;
  };
  selected: number;
  correct: boolean;
  confidence: number;
  seconds: number;
  recognitionSeconds: number;
  changes: number;
  hint: boolean;
  at: number;
  sessionId: string;
  demo: boolean;
};
export type Revision = {
  questionId: string;
  due: number;
  intervalDays: number;
  reason: string;
};
export type StudySession = {
  id: string;
  queue: string[];
  index: number;
  started: number;
  completed: boolean;
  kind: string;
  versions?: Record<string, number>;
};
export type Learner = {
  id: string;
  demo: boolean;
  target: "SI" | "Constable";
  attempts: Attempt[];
  bookmarks: string[];
  revisions: Revision[];
  session: StudySession | null;
  events: {
    id: string;
    type: string;
    at: number;
    questionId?: string;
    value?: string;
  }[];
};
export const rules = {
  version: "1.1.0",
  confusionThreshold: 2,
  slowSeconds: 60,
  repairMinimum: 6,
  repairAccuracy: 0.75,
  recentWindow: 8,
  maxEvents: 1000,
};
export const pct = (v: boolean[]) =>
  v.length ? Math.round((v.filter(Boolean).length / v.length) * 100) : 0;
export function createLearner(
  id: string,
  demo = true,
  now = Date.now(),
): Learner {
  const attempts: Attempt[] = demo
    ? [
        ["TM-Q001", 2, false, 85, 24],
        ["TM-Q001", 2, false, 85, 21],
        ["TM-Q002", 1, true, 60, 84],
        ["TM-Q006", 2, false, 85, 19],
        ["TM-Q004", 1, true, 60, 35],
      ].map((a, i) => ({
        id: `${id}-seed-${i}`,
        questionId: String(a[0]),
        selected: Number(a[1]),
        correct: Boolean(a[2]),
        confidence: Number(a[3]),
        seconds: Number(a[4]),
        recognitionSeconds: 9,
        changes: 0,
        hint: false,
        at: now - 86400000 - (4 - i) * 120000,
        sessionId: "demo-history",
        demo: true,
      }))
    : [];
  return {
    id,
    demo,
    target: "SI",
    attempts,
    bookmarks: [],
    revisions: demo
      ? [
          {
            questionId: "TM-Q010",
            due: now - 1000,
            intervalDays: 0,
            reason:
              "Two selections of Mulki Rules in place of the Six-Point Formula.",
          },
        ]
      : [],
    session: null,
    events: [],
  };
}
export function stats(
  state: Learner,
  now = Date.now(),
  pool: Question[] = questions,
) {
  const questions = pool;
  const a = state.attempts,
    recent = a.slice(-rules.recentWindow),
    live = a.filter((x) => !x.demo);
  const confusion = a.filter(
    (x) =>
      !x.correct &&
      (x.evidence?.selectedConfusion ??
        questions.find((q) => q.id === x.questionId)?.options[x.selected]
          ?.confusion),
  );
  const first = a.filter(
    (x, i) => a.findIndex((y) => y.questionId === x.questionId) === i,
  );
  const independent = live.slice(-8).filter((x) => !x.hint);
  const modelCoverage = new Set(
    independent
      .filter((x) => x.correct)
      .map(
        (x) =>
          x.evidence?.model ??
          questions.find((q) => q.id === x.questionId)?.model,
      )
      .filter(Boolean),
  ).size;
  const reworded = independent.some(
    (x) =>
      x.correct &&
      (x.evidence?.stage ??
        questions.find((q) => q.id === x.questionId)?.stage) === "rewording",
  );
  const improved =
    independent.length >= rules.repairMinimum &&
    pct(independent.map((x) => x.correct)) >= rules.repairAccuracy * 100 &&
    independent.slice(-3).every((x) => x.correct) &&
    modelCoverage >= 3 &&
    reworded;
  const recall = live.filter(
    (x) =>
      (x.evidence?.stage ??
        questions.find((q) => q.id === x.questionId)?.stage) === "recall",
  );
  const previousAttempt = (x: Attempt) =>
    live.filter((y) => y.at < x.at).at(-1);
  const delayedRecall = recall.filter((x) => {
    const prior = previousAttempt(x);
    return prior && x.at - prior.at >= 15 * 60000;
  });
  const spaced = recall.filter((x) => {
    const prior = previousAttempt(x);
    return x.correct && !x.hint && prior && x.at - prior.at >= 86400000;
  });
  const stable =
    improved &&
    new Set(spaced.map((x) => new Date(x.at).toISOString().slice(0, 10)))
      .size >= 2;
  const mean = a.length
    ? Math.round(a.reduce((s, x) => s + x.seconds, 0) / a.length)
    : 0;
  const times = a.map((x) => x.seconds).sort((x, y) => x - y),
    mid = Math.floor(times.length / 2);
  const median = times.length
    ? times.length % 2
      ? times[mid]
      : (times[mid - 1] + times[mid]) / 2
    : 0;
  const due = state.revisions.filter((r) => r.due <= now);
  const status = stable
    ? "MASTERED_STABLE"
    : improved
      ? "RECALL_READY"
      : confusion.length >= 2
        ? "REPAIRING"
        : a.length
          ? "PRACTISING"
          : "UNSEEN";
  const confidence = a.length
    ? Math.round(
        100 -
          a.reduce(
            (s, x) => s + Math.abs(x.confidence - (x.correct ? 100 : 0)),
            0,
          ) /
            a.length,
      )
    : 0;
  const hintFree = a.filter((x) => !x.hint),
    hinted = a.filter((x) => x.hint),
    retries = a.filter((x) => !first.includes(x));
  const models = Array.from(new Set(questions.map((q) => q.model))).map(
    (model) => {
      const attempts = a.filter(
        (x) =>
          (x.evidence?.model ??
            questions.find((q) => q.id === x.questionId)?.model) === model,
      );
      return {
        model,
        count: attempts.length,
        accuracy: pct(attempts.map((x) => x.correct)),
        seconds: attempts.length
          ? Math.round(
              attempts.reduce((s, x) => s + x.seconds, 0) / attempts.length,
            )
          : 0,
      };
    },
  );
  const last8 = live.slice(-8),
    previous8 = live.slice(-16, -8);
  const decline =
    last8.length === 8 &&
    previous8.length === 8 &&
    pct(last8.map((x) => x.correct)) <
      pct(previous8.map((x) => x.correct)) - 20;
  return {
    total: a.length,
    live: live.length,
    accuracy: pct(a.map((x) => x.correct)),
    first: pct(first.map((x) => x.correct)),
    recent: pct(recent.map((x) => x.correct)),
    retry: pct(retries.map((x) => x.correct)),
    hinted: pct(hinted.map((x) => x.correct)),
    independent: pct(hintFree.map((x) => x.correct)),
    confidence,
    mean,
    median,
    confusion: confusion.length,
    improved,
    stable,
    status,
    due,
    models,
    highConfidenceWrong: a.filter((x) => !x.correct && x.confidence >= 80)
      .length,
    retention: delayedRecall.length
      ? pct(delayedRecall.map((x) => x.correct))
      : null,
    decline,
  };
}
export function recommendation(
  state: Learner,
  now = Date.now(),
  pool: Question[] = questions,
) {
  const s = stats(state, now, pool);
  if (state.session && !state.session.completed)
    return {
      kind: "continue",
      title: "Pick up where you left off",
      reason: `${state.session.index} of ${state.session.queue.length} questions completed. Your session is saved.`,
      action: "Continue session",
    };
  if (s.improved && s.due.length)
    return {
      kind: "recall",
      title: "Check what stayed with you",
      reason:
        "Your scheduled recall is due. Try changed wording without a hint.",
      action: "Start recall",
    };
  if (s.improved)
    return {
      kind: "space",
      title: "Give this learning some space",
      reason: `Recent accuracy is ${s.recent}%. Immediate repetition is reduced; your next retrieval is scheduled.`,
      action: "View revision plan",
    };
  if (s.confusion >= rules.confusionThreshold)
    return {
      kind: "repair",
      title: "Separate the rule from the formula.",
      reason: `You selected the paired concept ${s.confusion} times. Compare Mulki Rules with the Six-Point Formula, then test the distinction.`,
      action: "Start comparison drill",
    };
  if (s.due.length)
    return {
      kind: "recall",
      title: "Bring an older concept back",
      reason: "A scheduled retrieval is due. Recall before rereading.",
      action: "Start recall",
    };
  return {
    kind: "foundation",
    title: "Build a clear first distinction.",
    reason:
      "Start with employment safeguards. Your answers will shape the next practice.",
    action: "Start smart practice",
  };
}
export function startSession(
  state: Learner,
  kind: string,
  now = Date.now(),
  pool: (Question & { version?: number })[] = questions,
) {
  const recentIds = new Set(
    state.attempts
      .filter((a) => !a.demo)
      .slice(-8)
      .map((a) => a.questionId),
  );
  const stages = { recognition: 0, practice: 1, rewording: 2, recall: 3 };
  const candidates = pool.filter((q) =>
    kind === "recall" ? q.stage === "recall" : q.stage !== "recall",
  );
  const ranked = candidates
    .map((q, index) => {
      const attempts = state.attempts.filter(
        (a) => a.questionId === q.id && !a.demo,
      );
      const modelAttempts = state.attempts.filter(
        (a) => pool.find((x) => x.id === a.questionId)?.model === q.model,
      );
      const wrong = modelAttempts.filter((a) => !a.correct).length;
      return {
        q,
        index,
        score:
          (recentIds.has(q.id) ? -100 : 0) +
          (attempts.length ? 0 : 30) +
          wrong * 2,
      };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index);
  let chosen: (Question & { version?: number })[];
  if (kind === "recall") {
    chosen = ranked.slice(0, 1).map((x) => x.q);
  } else if (
    (kind === "repair" || kind === "foundation") &&
    candidates.some((q) => q.stage === "rewording")
  ) {
    const rec = ranked.filter((x) => x.q.stage === "recognition");
    const prac = ranked.filter((x) => x.q.stage === "practice");
    const rew = ranked.filter((x) => x.q.stage === "rewording");
    const pracSelected: typeof prac = [];
    const remainingPrac = [...prac];
    while (pracSelected.length < 5 && remainingPrac.length > 0) {
      const idx = remainingPrac.findIndex(
        (p) => !pracSelected.some((s) => s.q.model === p.q.model),
      );
      if (idx !== -1) {
        pracSelected.push(remainingPrac.splice(idx, 1)[0]);
      } else {
        pracSelected.push(remainingPrac.shift()!);
      }
    }
    chosen = [
      ...rec.slice(0, 3),
      ...pracSelected,
      ...rew.slice(0, 1),
    ].map((x) => x.q);
    if (chosen.length < 9) {
      const chosenSet = new Set(chosen.map((q) => q.id));
      for (const item of ranked) {
        if (!chosenSet.has(item.q.id) && item.q.stage !== "recall") {
          chosen.push(item.q);
          chosenSet.add(item.q.id);
          if (chosen.length >= 9) break;
        }
      }
    }
  } else {
    chosen = ranked.slice(0, 9).map((x) => x.q);
  }
  if (!chosen.length)
    throw new Error(
      "No reviewed questions are available for this practice yet.",
    );
  const queue = chosen.map((q) => q.id);
  state.session = {
    id: crypto.randomUUID(),
    queue,
    index: 0,
    started: now,
    completed: false,
    kind,
    versions: Object.fromEntries(chosen.map((q) => [q.id, q.version || 1])),
  };
  log(state, "session_started", undefined, kind, now);
  return state;
}
export function log(
  state: Learner,
  type: string,
  questionId?: string,
  value?: string,
  at = Date.now(),
) {
  state.events.push({ id: crypto.randomUUID(), type, at, questionId, value });
  state.events = state.events.slice(-rules.maxEvents);
}
export function classify(a: Attempt, question?: Question) {
  const q = question || questions.find((q) => q.id === a.questionId);
  if (a.correct)
    return a.hint
      ? "Hint-assisted recall"
      : a.seconds > rules.slowSeconds
        ? "Correct, slower recognition"
        : "Independent recall";
  if (a.confidence >= 80) return "High-confidence error";
  if (q?.options[a.selected]?.confusion) return "Possible concept confusion";
  if (q?.model === "Chronology") return "Chronology error";
  if (q?.model === "Negative wording") return "Possible negative-word error";
  return "Knowledge or interpretation gap";
}
export function recordAttempt(
  state: Learner,
  attempt: Attempt,
  now = Date.now(),
  pool: Question[] = questions,
) {
  const questions = pool;
  if (state.attempts.some((a) => a.id === attempt.id)) return state;
  state.attempts.push(attempt);
  const q = questions.find((q) => q.id === attempt.questionId)!;
  const previous = state.revisions.find((r) => r.questionId === "TM-Q010");
  const current = stats(state, now, pool);
  const interval =
    !attempt.correct ||
    attempt.hint ||
    (current.confusion >= rules.confusionThreshold && !current.improved)
      ? 0
      : q.stage === "recall" && previous && previous.due <= now
        ? Math.min(14, Math.max(1, previous.intervalDays * 2))
        : 1;
  const due = now + (interval === 0 ? 15 * 60000 : interval * 86400000);
  state.revisions = [
    {
      questionId: "TM-Q010",
      due,
      intervalDays: interval,
      reason: !attempt.correct
        ? "Retrieve after correcting the misconception."
        : attempt.hint
          ? "Try independent recall after using a hint."
          : interval === 0
            ? "The repeated confusion still needs independent, varied recall."
            : current.improved
              ? "Independent recall improved; immediate repetition reduced."
              : "Check the distinction again after a delay.",
    },
  ];
  log(state, "answer_submitted", q.id, classify(attempt, q), now);
  if (state.session) {
    const ss = state.session;
    ss.index++;
    if (!attempt.correct) {
      const remaining = ss.queue.slice(ss.index);
      const alternative =
        remaining.find(
          (id) => questions.find((x) => x.id === id)?.model === q.model,
        ) ||
        remaining.find(
          (id) => questions.find((x) => x.id === id)?.stage === "recognition",
        );
      if (alternative)
        ss.queue.splice(
          ss.index,
          remaining.length,
          alternative,
          ...remaining.filter((id) => id !== alternative),
        );
      log(
        state,
        "mentor_recommendation_opened",
        q.id,
        "Review the comparison before changed-wording practice.",
        now,
      );
    }
    if (current.improved && ss.kind !== "recall") {
      ss.queue = ss.queue.slice(0, ss.index);
    }
    if (ss.index >= ss.queue.length) {
      ss.completed = true;
      log(state, "session_ended", undefined, "completed", now);
    }
  }
  return state;
}

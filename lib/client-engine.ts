import { allQuestions } from "./all-questions";
import {
  createLearner,
  recordAttempt,
  startSession,
  stats,
  recommendation,
  log,
  type Learner,
  type Attempt,
} from "./engine";
import { studyQuestion } from "./question-response";
import type { Question } from "./content";
import type { StudyQuestion } from "./contracts";

export type ClientUser = {
  id: string;
  name: string;
  email: string;
  target: "SI" | "Constable";
  learnerId: string;
  passwordHash?: string;
  salt?: string;
};

const IS_BROWSER = typeof window !== "undefined";

function getStorage<T>(key: string, fallback: T): T {
  if (!IS_BROWSER) return fallback;
  try {
    const val = localStorage.getItem(key);
    return val ? (JSON.parse(val) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (!IS_BROWSER) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("Storage write error", e);
  }
}

export function getCurrentUser(): ClientUser | null {
  return getStorage<ClientUser | null>("pyq_current_user", null);
}

export function setCurrentUser(user: ClientUser | null): void {
  setStorage("pyq_current_user", user);
}

export function getAllUsers(): ClientUser[] {
  return getStorage<ClientUser[]>("pyq_users", []);
}

export function saveUser(user: ClientUser): void {
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
  if (idx >= 0) {
    users[idx] = user;
  } else {
    users.push(user);
  }
  setStorage("pyq_users", users);
}

export function getClientLearner(): Learner {
  const user = getCurrentUser();
  const learnerKey = user ? `pyq_learner_${user.learnerId}` : "pyq_guest_learner";
  let learner = getStorage<Learner | null>(learnerKey, null);
  if (!learner) {
    learner = createLearner(user?.learnerId || crypto.randomUUID(), false);
    if (user?.target) learner.target = user.target;
    setStorage(learnerKey, learner);
  }
  return learner;
}

export function saveClientLearner(learner: Learner): void {
  const user = getCurrentUser();
  const learnerKey = user ? `pyq_learner_${user.learnerId}` : "pyq_guest_learner";
  setStorage(learnerKey, learner);
}

export function findClientQuestion(id: string, version?: number): (Question & { version: number }) | null {
  const q = allQuestions.find((item) => item.id === id);
  if (!q) return null;
  return { ...q, version: version || 1 };
}

export function clientLearnerQuestionPool(state: Learner): (Question & { version: number })[] {
  const ids = new Set([
    ...state.attempts.map((a) => a.questionId),
    ...state.bookmarks,
    ...state.revisions.map((r) => r.questionId),
    ...(state.session?.queue || []),
  ]);
  return [...ids]
    .map((id) => findClientQuestion(id, state.session?.versions?.[id]))
    .filter((q): q is Question & { version: number } => q !== null);
}

export function clientPracticeCandidates(state: Learner, kind: string): (Question & { version: number })[] {
  const isRecall = kind === "recall";
  const attemptsByQ = new Map<string, { exposures: number; lastSeen: number }>();
  for (const a of state.attempts) {
    if (a.demo) continue;
    const cur = attemptsByQ.get(a.questionId) || { exposures: 0, lastSeen: 0 };
    cur.exposures += 1;
    cur.lastSeen = Math.max(cur.lastSeen, a.at);
    attemptsByQ.set(a.questionId, cur);
  }

  const eligible = allQuestions.filter((q) => {
    return isRecall ? q.stage === "recall" : q.stage !== "recall";
  });

  eligible.sort((a, b) => {
    const statA = attemptsByQ.get(a.id) || { exposures: 0, lastSeen: 0 };
    const statB = attemptsByQ.get(b.id) || { exposures: 0, lastSeen: 0 };
    if (statA.exposures !== statB.exposures) return statA.exposures - statB.exposures;
    if (statA.lastSeen !== statB.lastSeen) return statA.lastSeen - statB.lastSeen;
    return a.id.localeCompare(b.id);
  });

  return eligible.slice(0, 50).map((q) => ({ ...q, version: 1 }));
}

export function getClientCorpusCounts() {
  const countsByStatus = new Map<string, number>();
  for (const q of allQuestions) {
    countsByStatus.set(q.sourceStatus, (countsByStatus.get(q.sourceStatus) || 0) + 1);
  }
  return {
    total: allQuestions.length,
    published: allQuestions.length,
    pendingReview: 0,
    versions: allQuestions.length,
    sources: 6,
    independentlyReviewed: 140,
    statuses: Array.from(countsByStatus.entries()).map(([status, count]) => ({ status, count })),
  };
}

export function getClientLearningData() {
  const learner = getClientLearner();
  const pool = clientLearnerQuestionPool(learner);
  const user = getCurrentUser();

  const requested = [
    ...(!learner.session?.completed && learner.session?.queue[learner.session.index]
      ? [
          {
            id: learner.session.queue[learner.session.index],
            version: learner.session.versions?.[learner.session.queue[learner.session.index]],
          },
        ]
      : []),
    ...learner.attempts
      .slice(-50)
      .reverse()
      .map((a) => ({ id: a.questionId, version: a.questionVersion || 1 })),
    ...learner.bookmarks.slice(-20).map((id) => ({ id, version: undefined })),
  ];

  const unique = new Map(requested.map((x) => [`${x.id}:${x.version || "latest"}`, x]));
  const visible: StudyQuestion[] = [...unique.values()]
    .slice(0, 50)
    .map((x) => findClientQuestion(x.id, x.version))
    .filter((q): q is Question & { version: number } => q !== null)
    .map(studyQuestion);

  return {
    learner: {
      ...learner,
      attempts: learner.attempts.slice(-100),
      events: learner.events.slice(-100),
    },
    stats: stats(learner, Date.now(), pool),
    recommendation: recommendation(learner, Date.now(), pool),
    questions: visible,
    corpus: getClientCorpusCounts(),
    user: user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          target: user.target,
        }
      : null,
  };
}

export function postClientLearningAction(d: any) {
  const learner = getClientLearner();

  if (d.action === "profile") {
    const fresh = createLearner(crypto.randomUUID(), d.demo);
    saveClientLearner(fresh);
    return getClientLearningData();
  }

  if (d.action === "target") {
    learner.target = d.target;
    const user = getCurrentUser();
    if (user) {
      user.target = d.target;
      saveUser(user);
      setCurrentUser(user);
    }
  }

  if (d.action === "start") {
    if (!learner.session || learner.session.completed) {
      const candidates = clientPracticeCandidates(learner, d.kind);
      startSession(learner, d.kind, Date.now(), candidates);
    }
  }

  if (d.action === "bookmark") {
    learner.bookmarks = learner.bookmarks.includes(d.questionId)
      ? learner.bookmarks.filter((x) => x !== d.questionId)
      : [...learner.bookmarks, d.questionId];
    log(learner, "bookmark_changed", d.questionId);
  }

  if (d.action === "event") {
    log(learner, d.type, d.questionId, d.value);
  }

  if (d.action === "answer") {
    const ss = learner.session;
    if (ss && ss.id === d.sessionId && !ss.completed && ss.queue[ss.index] === d.questionId) {
      const q = findClientQuestion(d.questionId, d.questionVersion);
      if (q && !learner.attempts.some((a) => a.id === d.id)) {
        recordAttempt(
          learner,
          {
            id: d.id,
            questionId: q.id,
            questionVersion: q.version,
            evidence: {
              model: q.model,
              stage: q.stage,
              concept: q.concept,
              selectedConfusion: Boolean(q.options[d.selected]?.confusion),
            },
            selected: d.selected,
            correct: d.selected === q.answer,
            confidence: d.confidence,
            seconds: d.seconds,
            recognitionSeconds: Math.min(d.seconds, d.recognitionSeconds),
            changes: d.changes,
            hint: d.hint,
            at: Date.now(),
            sessionId: ss.id,
            demo: false,
          },
          Date.now(),
        );
      }
    }
  }

  saveClientLearner(learner);
  return getClientLearningData();
}

export async function hashPasswordClient(password: string, salt: string): Promise<string> {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const enc = new TextEncoder();
    const data = enc.encode(password + ":" + salt);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  // Fallback simple hash for older runtimes
  let hash = 0;
  for (let i = 0; i < (password + salt).length; i++) {
    hash = ((hash << 5) - hash + (password + salt).charCodeAt(i)) | 0;
  }
  return hash.toString(16);
}

export async function postClientAuthAction(d: any) {
  if (d.action === "register") {
    const users = getAllUsers();
    if (users.some((u) => u.email.toLowerCase() === d.email.toLowerCase())) {
      throw new Error("An account with this email already exists.");
    }
    const salt = crypto.randomUUID();
    const passwordHash = await hashPasswordClient(d.password, salt);
    const learnerId = crypto.randomUUID();
    const newUser: ClientUser = {
      id: crypto.randomUUID(),
      name: d.name,
      email: d.email,
      target: d.targetExam || "SI",
      learnerId,
      passwordHash,
      salt,
    };
    saveUser(newUser);
    setCurrentUser(newUser);

    // Initialize personal learner profile
    const personalLearner = createLearner(learnerId, false);
    personalLearner.target = newUser.target;
    saveClientLearner(personalLearner);

    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        target: newUser.target,
      },
    };
  }

  if (d.action === "login") {
    const users = getAllUsers();
    const user = users.find((u) => u.email.toLowerCase() === d.email.toLowerCase());
    if (!user || !user.salt || !user.passwordHash) {
      throw new Error("Invalid email or password.");
    }
    const computedHash = await hashPasswordClient(d.password, user.salt);
    if (computedHash !== user.passwordHash) {
      throw new Error("Invalid email or password.");
    }
    setCurrentUser(user);
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        target: user.target,
      },
    };
  }

  if (d.action === "logout") {
    setCurrentUser(null);
    return { success: true };
  }

  if (d.action === "target") {
    const user = getCurrentUser();
    if (user) {
      user.target = d.target;
      saveUser(user);
      setCurrentUser(user);
    }
    const learner = getClientLearner();
    learner.target = d.target;
    saveClientLearner(learner);
    return { success: true, target: d.target };
  }

  throw new Error("Invalid auth action");
}

export function searchClientQuestions(params: {
  topic?: string;
  stage?: string;
  status?: string;
  q?: string;
  limit?: number;
}) {
  let list = allQuestions;

  if (params.topic) {
    list = list.filter((item) => item.topic === params.topic);
  }
  if (params.stage) {
    list = list.filter((item) => item.stage === params.stage);
  }
  if (params.status) {
    list = list.filter((item) => item.sourceStatus === params.status);
  }
  if (params.q) {
    const query = params.q.toLowerCase();
    list = list.filter(
      (item) =>
        item.prompt.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query) ||
        item.options.some((o) => o.text.toLowerCase().includes(query)),
    );
  }

  const limit = params.limit || 50;
  return list.slice(0, limit).map((q) => studyQuestion({ ...q, version: 1 }));
}

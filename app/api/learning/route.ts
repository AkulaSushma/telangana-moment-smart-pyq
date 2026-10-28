import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createProfile,
  mutate,
  readLearner,
  findQuestion,
  corpusCounts,
  learnerQuestionPool,
  practiceCandidates,
  db,
} from "@/lib/db";
import {
  log,
  recordAttempt,
  startSession,
  stats,
  recommendation,
  type Learner,
} from "@/lib/engine";
import { studyQuestion } from "@/lib/question-response";
import { getUserBySession, type AuthUser } from "@/lib/auth";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const events = [
  "question_viewed",
  "answer_selected",
  "answer_changed",
  "question_skipped",
  "explanation_opened",
  "explanation_section_opened",
  "hint_requested",
  "comparison_opened",
  "app_backgrounded",
  "app_returned",
  "confidence_selected",
  "topic_opened",
  "mentor_recommendation_opened",
] as const;
const schema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("start"),
    kind: z.enum(["repair", "foundation", "recall", "mixed", "timed"]),
  }),
  z.object({
    action: z.literal("answer"),
    id: z.string().uuid(),
    sessionId: z.string().uuid(),
    questionId: z.string(),
    questionVersion: z.number().int().positive().optional(),
    selected: z.number().int().min(0).max(3),
    confidence: z.union([z.literal(35), z.literal(60), z.literal(85)]),
    seconds: z.number().min(0).max(86400),
    recognitionSeconds: z.number().min(0).max(86400),
    changes: z.number().int().min(0).max(1000),
    hint: z.boolean(),
  }),
  z.object({
    action: z.literal("event"),
    type: z.enum(events),
    questionId: z.string().optional(),
    value: z.string().max(200).optional(),
  }),
  z.object({ action: z.literal("bookmark"), questionId: z.string() }),
  z.object({ action: z.literal("profile"), demo: z.boolean() }),
  z.object({
    action: z.literal("target"),
    target: z.enum(["SI", "Constable"]),
  }),
]);
function response(
  s: Learner,
  fresh = false,
  user: AuthUser | null = null,
) {
  const pool = learnerQuestionPool(s);
  const requested = [
    ...(!s.session?.completed && s.session?.queue[s.session.index]
      ? [
          {
            id: s.session.queue[s.session.index],
            version: s.session.versions?.[s.session.queue[s.session.index]],
          },
        ]
      : []),
    ...s.attempts
      .slice(-50)
      .reverse()
      .map((a) => ({ id: a.questionId, version: a.questionVersion || 1 })),
    ...s.bookmarks.slice(-20).map((id) => ({ id, version: undefined })),
  ];
  const unique = new Map(
    requested.map((x) => [`${x.id}:${x.version || "latest"}`, x]),
  );
  const visible = [...unique.values()]
    .slice(0, 50)
    .map((x) => findQuestion(x.id, x.version))
    .filter((q) => q !== null)
    .map(studyQuestion);
  const r = NextResponse.json(
    {
      learner: {
        ...s,
        attempts: s.attempts.slice(-100),
        events: s.events.slice(-100),
      },
      stats: stats(s, Date.now(), pool),
      recommendation: recommendation(s, Date.now(), pool),
      questions: visible,
      corpus: corpusCounts(),
      user: user
        ? {
            id: user.id,
            name: user.name,
            email: user.email,
            target: user.target,
          }
        : null,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
  if (fresh)
    r.cookies.set("pyq_learner", s.id, {
      httpOnly: true,
      sameSite: "lax",
      secure:
        process.env.NODE_ENV === "production" &&
        process.env.PYQ_HTTPS === "true",
      maxAge: 31536000,
      path: "/",
    });
  return r;
}
export async function GET(req: NextRequest) {
  const sessionToken = req.cookies.get("pyq_session")?.value;
  const authUser = sessionToken ? getUserBySession(db, sessionToken) : null;
  const id = authUser?.learnerId || req.cookies.get("pyq_learner")?.value;
  const s = id ? readLearner(id) : null;
  return s ? response(s, false, authUser) : response(createProfile(true), true, authUser);
}
export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const expectedOrigin = `${new URL(req.url).protocol}//${req.headers.get("host")}`;
  if (origin && origin !== expectedOrigin)
    return NextResponse.json(
      { error: "Request origin does not match." },
      { status: 403 },
    );
  try {
    if (Number(req.headers.get("content-length") || 0) > 8192)
      return NextResponse.json(
        { error: "Request too large." },
        { status: 413 },
      );
    const body = await req.text();
    if (Buffer.byteLength(body, "utf8") > 8192)
      return NextResponse.json(
        { error: "Request too large." },
        { status: 413 },
      );
    let json;
    try {
      json = JSON.parse(body);
    } catch {
      return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
    }
    const parsed = schema.safeParse(json);
    if (!parsed.success)
      return NextResponse.json(
        { error: "Invalid learning action." },
        { status: 400 },
      );
    const sessionToken = req.cookies.get("pyq_session")?.value;
    const authUser = sessionToken ? getUserBySession(db, sessionToken) : null;
    const d = parsed.data;
    if (d.action === "profile") return response(createProfile(d.demo), true, authUser);
    const id = authUser?.learnerId || req.cookies.get("pyq_learner")?.value;
    if (!id || !readLearner(id))
      return NextResponse.json(
        { error: "Reload to restore your learning profile." },
        { status: 401 },
      );
    const s = mutate(id, (state) => {
      if (d.action === "target") state.target = d.target;
      if (d.action === "start") {
        if (state.session && !state.session.completed) return state;
        const candidates = practiceCandidates(state, d.kind);
        startSession(state, d.kind, Date.now(), candidates);
      }
      if (d.action === "bookmark") {
        if (!findQuestion(d.questionId)) throw new Error("Unknown question");
        state.bookmarks = state.bookmarks.includes(d.questionId)
          ? state.bookmarks.filter((x) => x !== d.questionId)
          : [...state.bookmarks, d.questionId];
        log(state, "bookmark_changed", d.questionId);
      }
      if (d.action === "event") {
        log(state, d.type, d.questionId, d.value);
      }
      if (d.action === "answer") {
        if (state.attempts.some((a) => a.id === d.id)) return state;
        const ss = state.session;
        if (
          !ss ||
          ss.id !== d.sessionId ||
          ss.completed ||
          ss.queue[ss.index] !== d.questionId
        )
          throw new Error(
            "This question changed in another tab. Reload to continue your saved session.",
          );
        const version = ss.versions?.[d.questionId] || 1;
        if (d.questionVersion && d.questionVersion !== version)
          throw new Error(
            "This question version changed. Reload your saved session.",
          );
        const q = findQuestion(d.questionId, version);
        if (!q)
          throw new Error("The saved question version could not be found.");
        recordAttempt(
          state,
          {
            id: d.id,
            questionId: q.id,
            questionVersion: q.version,
            evidence: {
              model: q.model,
              stage: q.stage,
              concept: q.concept,
              selectedConfusion: Boolean(q.options[d.selected].confusion),
            },
            selected: d.selected,
            correct: d.selected === q.answer,
            confidence: d.confidence,
            seconds: d.seconds,
            recognitionSeconds: Math.min(d.seconds, d.recognitionSeconds),
            changes: d.changes,
            hint:
              d.hint ||
              state.events.some(
                (e) =>
                  e.type === "hint_requested" &&
                  e.questionId === q.id &&
                  e.at >= ss.started,
              ),
            at: Date.now(),
            sessionId: ss.id,
            demo: false,
          },
          Date.now(),
          learnerQuestionPool(state),
        );
      }
      return state;
    });
    return response(s, false, authUser);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not save your answer. Try again.",
      },
      { status: 409 },
    );
  }
}

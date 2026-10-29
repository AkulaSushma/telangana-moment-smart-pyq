"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Compass,
  FileText,
  Flag,
  GitCompareArrows,
  GraduationCap,
  History,
  House,
  Layers3,
  Lightbulb,
  ListFilter,
  MessageCircle,
  MoreHorizontal,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  X,
  RotateCcw,
  CalendarDays,
  PanelLeftClose,
  ExternalLink,
} from "lucide-react";
import {
  comparison,
  topics,
  sourceUrl,
  syllabusUrl,
  type Question,
} from "@/lib/content";
import {
  type Learner,
  type Attempt,
  type stats,
  type recommendation,
} from "@/lib/engine";
import { classify } from "@/lib/classification";
import type { StudyQuestion } from "@/lib/contracts";
import { TeacherExplanation } from "./teacher-explanation";
import {
  getClientLearningData,
  postClientLearningAction,
  postClientAuthAction,
  searchClientQuestions,
} from "@/lib/client-engine";
type Data = {
  learner: Learner;
  stats: ReturnType<typeof stats>;
  recommendation: ReturnType<typeof recommendation>;
  questions: StudyQuestion[];
  corpus: { published: number; statuses: { status: string; count: number }[] };
  user?: {
    id: string;
    name: string;
    email: string;
    target: "SI" | "Constable";
  } | null;
};
type View =
  | "Home"
  | "Practice"
  | "Topic map"
  | "Papers"
  | "Mistake book"
  | "Revision queue"
  | "Performance"
  | "Mentor"
  | "Bookmarks"
  | "Learning history"
  | "Profile"
  | "Sources"
  | "Search";
const nav = [
  { name: "Home", icon: House },
  { name: "Practice", icon: Compass },
  { name: "Topic map", icon: Layers3 },
  { name: "Papers", icon: FileText },
  { name: "Mistake book", icon: BookOpen },
  { name: "Revision queue", icon: RotateCcw },
  { name: "Performance", icon: TrendingUp },
  { name: "Mentor", icon: MessageCircle },
] as const;
const displayPosition = (q: Question, i: number) =>
  (i - (((Number(q.id.replace(/\D/g, "")) || 1) - 1) % 4) + 4) % 4;
const answerLetter = (q: Question, i: number) =>
  String.fromCharCode(65 + displayPosition(q, i));
const pretty = (n: number) =>
  n === 1 ? "1st" : n === 2 ? "2nd" : n === 3 ? "3rd" : `${n}th`;
const date = (n: number) =>
  new Date(n).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
function Brand() {
  return (
    <div className="brand">
      <div className="brand-mark">
        <BookOpen size={22} />
      </div>
      <div>
        <b>
          sadhana<span>.</span>
        </b>
        <small>Learn with intention</small>
      </div>
    </div>
  );
}
export default function LearningApp() {
  const [data, setData] = useState<Data | null>(null),
    [view, setView] = useState<View>("Home"),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [search, setSearch] = useState(""),
    [topic, setTopic] = useState<string | null>(null),
    [paper, setPaper] = useState("SI"),
    [compare, setCompare] = useState(false),
    [result, setResult] = useState<Attempt | null>(null),
    [selected, setSelected] = useState<number | null>(null),
    [confidence, setConfidence] = useState<number | null>(null),
    [hint, setHint] = useState(false),
    [elapsed, setElapsed] = useState(0),
    [explain, setExplain] = useState(false);
  const [library, setLibrary] = useState<StudyQuestion[]>([]);
  const [libraryTotal, setLibraryTotal] = useState(0);
  const [libraryOffset, setLibraryOffset] = useState(0);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [libraryError, setLibraryError] = useState("");
  const [previewQuestion, setPreviewQuestion] = useState<StudyQuestion | null>(
    null,
  );
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authTarget, setAuthTarget] = useState<"SI" | "Constable">("SI");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authBusy, setAuthBusy] = useState(false);
  const questions = [
    ...new Map(
      [
        ...(data?.questions || []),
        ...library,
        ...(previewQuestion ? [previewQuestion] : []),
      ].map((q) => [`${q.id}:${q.version}`, q]),
    ).values(),
  ];
  const started = useRef(Date.now()),
    recognition = useRef(0),
    changes = useRef(0),
    attemptId = useRef(""),
    active = useRef(true),
    activeTime = useRef(0),
    lastTick = useRef(Date.now());
  const session = data?.learner.session;
  const q = questions.find(
    (q) =>
      q.id ===
        (result?.questionId ||
          (!session?.completed ? session?.queue[session?.index || 0] : null)) &&
      q.version === (result?.questionVersion || session?.versions?.[q.id] || 1),
  );
  async function load() {
    try {
      const r = await fetch("/api/learning");
      if (r.ok) {
        setData(await r.json());
        setError("");
        return;
      }
    } catch {}
    // Client-side fallback for Cloudflare Pages / static hosting
    try {
      const fallback = getClientLearningData();
      setData(fallback as unknown as Data);
      setError("");
    } catch (e) {
      setError(String(e));
    }
  }

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    setAuthBusy(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: authMode,
          name: authName,
          email: authEmail,
          password: authPassword,
          target: authTarget,
        }),
      });
      if (res.ok) {
        setAuthOpen(false);
        setAuthPassword("");
        setAuthError(null);
        await load();
        return;
      }
      const result = await res.json();
      throw new Error(result.error || "Authentication failed.");
    } catch {
      // Client-side auth fallback
      try {
        await postClientAuthAction({
          action: authMode,
          name: authName,
          email: authEmail,
          password: authPassword,
          targetExam: authTarget,
        });
        setAuthOpen(false);
        setAuthPassword("");
        setAuthError(null);
        await load();
      } catch (err) {
        setAuthError(err instanceof Error ? err.message : "Authentication error.");
      }
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
    } catch {}
    try {
      await postClientAuthAction({ action: "logout" });
    } catch {}
    await load();
  }
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => {
    if (!data || (view !== "Search" && view !== "Bookmarks")) return;
    const controller = new AbortController();
    setLibraryLoading(true);
    setLibraryError("");
    const query = new URLSearchParams({
      limit: "20",
      offset: String(libraryOffset),
      ...(view === "Bookmarks" ? { bookmarks: "true" } : { query: search }),
    });
    const timer = setTimeout(() => {
      fetch(`/api/questions?${query}`, { signal: controller.signal })
        .then(async (r) => {
          if (!r.ok)
            throw new Error("Could not load the questions. Try again.");
          return r.json();
        })
        .then((page) => {
          setLibrary(page.items);
          setLibraryTotal(page.total);
        })
        .catch((e) => {
          if (e.name === "AbortError") return;
          // Fallback to client question search
          const allFound = searchClientQuestions({
            topic: topic || undefined,
            q: search || undefined,
            limit: 150,
          });
          const filtered = view === "Bookmarks"
            ? allFound.filter((q) => data.learner.bookmarks.includes(q.id))
            : allFound;
          setLibrary(filtered.slice(libraryOffset, libraryOffset + 20));
          setLibraryTotal(filtered.length);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLibraryLoading(false);
        });
    }, 180);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    view,
    search,
    libraryOffset,
    data?.learner.id,
    data?.learner.bookmarks.join(","),
  ]);
  async function send(payload: Record<string, unknown>, quiet = false) {
    if (!quiet) setBusy(true);
    try {
      const r = await fetch("/api/learning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (r.ok) {
        const next = await r.json();
        if (!quiet) setData(next);
        setError("");
        return next as Data;
      }
    } catch {}
    // Client-side learning fallback
    try {
      const next = postClientLearningAction(payload);
      if (!quiet) setData(next as unknown as Data);
      setError("");
      return next as unknown as Data;
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not save. Please try again.",
      );
      return null;
    } finally {
      if (!quiet) setBusy(false);
    }
  }
  function event(type: string, questionId?: string, value?: string) {
    void send({ action: "event", type, questionId, value }, true);
  }
  useEffect(() => {
    function visibility() {
      active.current = !document.hidden;
      lastTick.current = Date.now();
      event(document.hidden ? "app_backgrounded" : "app_returned", q?.id);
    }
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, [q?.id]);
  useEffect(() => {
    if (view !== "Practice" || !q || result || compare) return;
    started.current = Date.now();
    lastTick.current = Date.now();
    activeTime.current = 0;
    recognition.current = 0;
    changes.current = 0;
    attemptId.current = crypto.randomUUID();
    setSelected(null);
    setConfidence(null);
    setHint(false);
    setElapsed(0);
    setExplain(false);
    setLibraryOffset(0);
    event("question_viewed", q.id);
    const t = setInterval(() => {
      const now = Date.now();
      if (active.current)
        activeTime.current += Math.min(now - lastTick.current, 2000);
      lastTick.current = now;
      setElapsed(Math.floor(activeTime.current / 1000));
    }, 1000);
    return () => clearInterval(t);
  }, [q?.id, view, compare, result?.id]);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(t);
  }, [notice]);
  function go(v: View) {
    setPreviewQuestion(null);
    setView(v);
    setTopic(null);
    setResult(null);
    setCompare(false);
    setExplain(false);
    window.scrollTo({ top: 0 });
  }
  async function start(kind = "repair") {
    const next = await send({ action: "start", kind });
    if (next) {
      setView("Practice");
      setResult(null);
      setCompare(kind === "repair" && next.learner.session?.index === 0);
      window.scrollTo({ top: 0 });
    }
  }
  function nextAction() {
    if (!data) return;
    const k = data.recommendation.kind;
    if (k === "space") go("Revision queue");
    else if (k === "continue") {
      setView("Practice");
      setResult(null);
      setCompare(false);
    } else void start(k);
  }
  async function submit() {
    if (!q || selected === null || confidence === null || !session) return;
    const next = await send({
      action: "answer",
      id: attemptId.current,
      sessionId: session.id,
      questionId: q.id,
      questionVersion: q.version,
      selected,
      confidence,
      seconds: Math.max(0.1, activeTime.current / 1000),
      recognitionSeconds: recognition.current,
      changes: changes.current,
      hint,
    });
    if (next) {
      setResult(
        next.learner.attempts.find((a) => a.id === attemptId.current) || null,
      );
      setExplain(false);
    }
  }
  function choose(i: number) {
    if (selected !== null && selected !== i) {
      changes.current++;
      event("answer_changed", q?.id, String(i));
    } else event("answer_selected", q?.id, String(i));
    if (!recognition.current) recognition.current = activeTime.current / 1000;
    setSelected(i);
  }
  async function bookmark(id: string) {
    const next = await send({ action: "bookmark", questionId: id });
    if (next)
      setNotice(
        next.learner.bookmarks.includes(id)
          ? "Question saved to bookmarks."
          : "Bookmark removed.",
      );
  }
  function nextQuestion() {
    setResult(null);
    setExplain(false);
    setCompare(false);
    window.scrollTo({ top: 0 });
  }
  function comparisonPanel() {
    return (
      <div className="comparison">
        <div className="section-heading">
          <div>
            <span className="eyebrow">One distinction to remember</span>
            <h2>Same concern. Different safeguards.</h2>
          </div>
          <GitCompareArrows size={28} />
        </div>
        <p>
          Both concern regional opportunity. The later formula proposed a
          different framework.
        </p>
        <div className="compare-head">
          <span>Mulki Rules</span>
          <span>Six-Point Formula</span>
        </div>
        {comparison.map(([label, left, right]) => (
          <div className="compare-row" key={label}>
            <small>{label}</small>
            <div>
              <p>{left}</p>
              <p>{right}</p>
            </div>
          </div>
        ))}
        <div className="memory">
          <Lightbulb size={20} />
          <p>
            <b>Remember the direction.</b> The formula proposed replacing the
            older rules. It did not introduce them.
          </p>
        </div>
        <a
          className="source-link"
          href={`${sourceUrl}#page=77`}
          target="_blank"
          rel="noreferrer"
        >
          Read the source · report §1.2.27 <ExternalLink size={13} />
        </a>
      </div>
    );
  }
  if (!data)
    return (
      <main className="loading">
        <Brand />
        <h1>Your next clear step.</h1>
        <p>{error || "Opening your learning workspace…"}</p>
        {error && (
          <button className="primary" onClick={load}>
            Try again
          </button>
        )}
      </main>
    );
  const { learner, stats: s, recommendation: r } = data;
  const last = learner.attempts.at(-1);
  const liveSession = learner.attempts.filter(
    (a) => a.sessionId === session?.id,
  );
  const wrong = learner.attempts.filter((a) => !a.correct);
  const sectionTitle: Record<View, string> = {
    Home: "Your learning workspace",
    Practice: "Smart practice",
    "Topic map": "The story, in sequence",
    Papers: "Previous papers",
    "Mistake book": "Turn mistakes into understanding",
    "Revision queue": "Remember it for longer",
    Performance: "Evidence of your learning",
    Mentor: "A little direction goes a long way",
    Bookmarks: "Your saved questions",
    "Learning history": "Your learning, remembered",
    Profile: "Your learning preferences",
    Sources: "Know where your content comes from",
    Search: "Find your next concept",
  };
  const metric = (label: string, value: string, detail: string) => (
    <div className="metric" key={label}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
  const questionList = (items: StudyQuestion[]) =>
    items.length ? (
      <div className="list">
        {items.map((item) => (
          <button
            className="list-row"
            key={item.id}
            onClick={() => {
              setPreviewQuestion(item);
              setTopic(item.id);
              setView("Bookmarks");
            }}
          >
            <BookOpen size={19} />
            <div>
              <b>{item.prompt}</b>
              <small>
                {item.model} · {item.sourceStatus.toLowerCase()}
              </small>
            </div>
            <ChevronRight size={18} />
          </button>
        ))}
      </div>
    ) : view === "Search" ? (
      <div className="empty-search" role="status">
        No matching questions yet. Try a concept or model such as Mulki or
        chronology.
      </div>
    ) : (
      <div className="empty">
        <Bookmark size={28} />
        <h3>Keep a useful question close.</h3>
        <p>Save questions during practice and find them here.</p>
        <button className="secondary" onClick={() => start("foundation")}>
          Start practice
        </button>
      </div>
    );
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <aside className="sidebar">
        <Brand />
        <div className="exam-label">
          <ShieldCheck size={17} />
          <span>TS Police SI & Constable</span>
        </div>
        <nav aria-label="Main navigation">
          {nav.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={view === name ? "nav-item active" : "nav-item"}
              onClick={() => go(name)}
            >
              <Icon size={19} />
              <span>{name}</span>
              {name === "Revision queue" && s.due.length > 0 && (
                <em>{s.due.length}</em>
              )}
              {name === "Mentor" && <span className="new-dot" />}
            </button>
          ))}
        </nav>
        <div className="nav-secondary">
          <span className="nav-caption">Your collection</span>
          <button onClick={() => go("Bookmarks")}>
            <Bookmark size={18} />
            Bookmarks <small>{learner.bookmarks.length || ""}</small>
          </button>
          <button onClick={() => go("Learning history")}>
            <History size={18} />
            Learning history
          </button>
          <button onClick={() => go("Sources")}>
            <ShieldCheck size={18} />
            Content & sources
          </button>
        </div>
        <div className="sidebar-bottom">
          <div className="mentor-small">
            <GraduationCap size={22} />
            <p>
              A clearer concept.
              <br />
              <b>A stronger attempt.</b>
            </p>
          </div>
          <button className="profile-button" onClick={() => go("Profile")}>
            <span className="avatar">
              {data?.user
                ? data.user.name.charAt(0).toUpperCase()
                : learner.demo
                  ? "D"
                  : "L"}
            </span>
            <span>
              <b>
                {data?.user
                  ? data.user.name
                  : learner.demo
                    ? "Demo learner"
                    : "My learning profile"}
              </b>
              <small>
                {(data?.user ? data.user.target : learner.target) === "SI"
                  ? "Sub-Inspector"
                  : "Constable"}{" "}
                {data?.user ? "instance" : "preparation"}
              </small>
            </span>
            <Settings2 size={17} />
          </button>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div>
            <span className="desktop-only">Learning</span>
            <ChevronRight className="desktop-only" size={14} />
            <b>Telangana Movement & State Formation</b>
          </div>
          <button
            className="search-button"
            aria-label="Search topics and questions"
            onClick={() => go("Search")}
          >
            <Search size={18} />
            <span>Search anything</span>
            <kbd>/</kbd>
          </button>
          {data?.user ? (
            <div className="user-chip desktop-only">
              <span
                className="avatar"
                style={{
                  width: 22,
                  height: 22,
                  fontSize: 11,
                  background: "var(--teal)",
                  color: "white",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                }}
              >
                {data.user.name.charAt(0).toUpperCase()}
              </span>
              <span>
                {data.user.name.split(" ")[0]} ({data.user.target})
              </span>
              <button
                className="logout-btn"
                onClick={handleLogout}
                title="Log out of your personal instance"
              >
                Log out
              </button>
            </div>
          ) : (
            <button
              className="sign-in-nav-btn desktop-only"
              onClick={() => {
                setAuthMode("login");
                setAuthError(null);
                setAuthOpen(true);
              }}
            >
              Sign In / Register
            </button>
          )}
          <button
            className="mobile-profile"
            onClick={() => go("Profile")}
            aria-label="Open profile"
          >
            <span className="avatar">
              {data?.user
                ? data.user.name.charAt(0).toUpperCase()
                : learner.demo
                  ? "D"
                  : "L"}
            </span>
          </button>
        </header>
        <main id="main" tabIndex={-1}>
          {error && (
            <div className="error" role="alert">
              <span>{error}</span>
              <button onClick={load}>Reload saved state</button>
            </div>
          )}
          {notice && (
            <div className="toast" role="status">
              <Check size={17} />
              {notice}
            </div>
          )}
          <div className="page-heading">
            <div>
              <div className="context-line">
                TS Police {learner.target} <span /> Telangana Movement
              </div>
              <h1>
                {view === "Home"
                  ? "Make today’s learning count."
                  : sectionTitle[view]}
              </h1>
              <p>
                {view === "Home"
                  ? "Small, focused steps. Understanding that stays."
                  : view === "Practice"
                    ? "Recognise the clue. Understand the distinction. Test it again."
                    : view === "Performance"
                      ? "Every number comes from your saved attempts."
                      : ""}
              </p>
            </div>
            {view === "Home" ? (
              <div className="today-date">
                <CalendarDays size={17} />
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </div>
            ) : (
              <button className="text-button" onClick={() => go("Home")}>
                <ArrowLeft size={16} /> Home
              </button>
            )}
          </div>
          {learner.demo && (
            <div className="demo-strip">
              <span>
                <span className="status-dot" /> Demo learner{" "}
                <span className="demo-extra">
                  · Seeded history; new answers update it live.
                </span>
              </span>
              <button onClick={() => go("Profile")}>
                Start fresh <ArrowUpRight size={13} />
              </button>
            </div>
          )}
          {view === "Home" && (
            <>
              <div className="home-grid">
                <section className="focus-card">
                  <div className="focus-top">
                    <span>
                      <Compass size={16} />
                      Your next best action
                    </span>
                    <span className="quiet-tag">
                      {s.improved ? "Recall ready" : "Focused repair"}
                    </span>
                  </div>
                  <div className="focus-content">
                    <div className="focus-copy">
                      <h2>{r.title}</h2>
                      <p className="focus-subject">
                        Mulki Rules <span>vs</span> Six-Point Formula
                      </p>
                      <p className="focus-reason">{r.reason}</p>
                      <div className="session-meta">
                        <span>
                          <Clock size={15} /> About 8 minutes
                        </span>
                        <span>
                          <Layers3 size={15} />{" "}
                          {s.improved
                            ? "Spaced retrieval"
                            : "Up to 9 questions"}
                        </span>
                      </div>
                      <button
                        className="primary"
                        onClick={nextAction}
                        disabled={busy}
                      >
                        {r.action}
                        <ArrowRight size={18} />
                      </button>
                    </div>
                    <div className="concept-art" aria-hidden="true">
                      <div className="art-note old-note">
                        <span>Earlier safeguard</span>
                        <b>
                          Mulki
                          <br />
                          Rules
                        </b>
                        <div className="note-lines">
                          <i />
                          <i />
                        </div>
                      </div>
                      <div className="versus-circle">
                        <GitCompareArrows size={20} />
                      </div>
                      <div className="art-note new-note">
                        <span>Later framework</span>
                        <b>
                          Six-Point
                          <br />
                          Formula
                        </b>
                        <div className="note-lines">
                          <i />
                          <i />
                        </div>
                        <span className="note-year">1973</span>
                      </div>
                    </div>
                  </div>
                  <div className="focus-footer">
                    <ShieldCheck size={15} />
                    <span>
                      Generated practice · explanations grounded in source
                      material
                    </span>
                  </div>
                </section>
                <aside className="session-plan">
                  <div className="section-heading">
                    <h3>A plan for this session</h3>
                    <MoreHorizontal size={18} />
                  </div>
                  <div className="plan-step">
                    <span className="step-number">1</span>
                    <div>
                      <b>Clear the confusion</b>
                      <p>A side-by-side comparison</p>
                    </div>
                    <span className="plan-time">2 min</span>
                  </div>
                  <div className="plan-step">
                    <span className="step-number">2</span>
                    <div>
                      <b>Recognise, then apply</b>
                      <p>3 recognition + 5 practice</p>
                    </div>
                    <span className="plan-time">5 min</span>
                  </div>
                  <div className="plan-step">
                    <span className="step-number">3</span>
                    <div>
                      <b>Make it stick</b>
                      <p>New wording + a later recall</p>
                    </div>
                    <span className="plan-time">1 min</span>
                  </div>
                  <div className="plan-note">
                    <Lightbulb size={17} />
                    <p>
                      Your answers can change this plan. You can choose another
                      activity.
                    </p>
                  </div>
                </aside>
              </div>
              <section className="pulse">
                <div className="section-heading">
                  <h2>Your learning pulse</h2>
                  <button
                    className="text-button"
                    onClick={() => go("Performance")}
                  >
                    See the evidence <ArrowUpRight size={15} />
                  </button>
                </div>
                <div className="metrics">
                  {metric(
                    "Recent accuracy",
                    s.total ? `${s.recent}%` : "Not tested",
                    `${Math.min(8, s.total)} most recent attempts`,
                  )}
                  {metric(
                    "First-attempt accuracy",
                    s.total ? `${s.first}%` : "Not tested",
                    "Before repeated practice",
                  )}
                  {metric(
                    "Recall retention",
                    s.retention === null ? "Not tested" : `${s.retention}%`,
                    "Measured after delayed recall",
                  )}
                  {metric(
                    "Ready for revision",
                    String(s.due.length),
                    s.due.length
                      ? "One focused concept family"
                      : "Your next recall is scheduled",
                  )}
                </div>
              </section>
              <div className="lower-grid">
                <section className="journey">
                  <div className="section-heading">
                    <div>
                      <h2>Your subject, one step at a time</h2>
                      <p>The movement from its roots to state formation.</p>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => go("Topic map")}
                    >
                      Topic map <ArrowUpRight size={15} />
                    </button>
                  </div>
                  <div className="phase-strip">
                    {topics.map((t, i) => (
                      <button
                        className={i === 1 ? "phase selected" : "phase"}
                        key={t.id}
                        onClick={() => {
                          go("Topic map");
                          setTopic(t.id);
                        }}
                      >
                        <span>{t.period}</span>
                        <b>{t.title}</b>
                        <div className="phase-line">
                          <i
                            style={{
                              width:
                                i === 1 ? `${Math.max(8, s.recent)}%` : "0%",
                            }}
                          />
                        </div>
                        <small>
                          {i === 1 ? "Your current focus" : "Not yet assessed"}
                        </small>
                      </button>
                    ))}
                  </div>
                  <div className="continue-row">
                    <span className="book-icon">
                      <BookOpen size={21} />
                    </span>
                    <div>
                      <b>Mulki Rules & Six-Point Formula</b>
                      <small>
                        {s.improved
                          ? "Ready for independent recall"
                          : "One distinction. Several question models."}
                      </small>
                    </div>
                    <button
                      className="icon-button"
                      aria-label="Continue safeguards topic"
                      onClick={nextAction}
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </section>
                <section className="revision-preview">
                  <div className="section-heading">
                    <h2>Keep it fresh</h2>
                    <RotateCcw size={18} />
                  </div>
                  <span className="amber-label">
                    {s.due.length ? "Revision due" : "Retrieval scheduled"}
                  </span>
                  <h3>Employment safeguards</h3>
                  <p>
                    {learner.revisions[0]?.reason ||
                      "Your first attempt will create a revision plan."}
                  </p>
                  <button
                    className="text-button"
                    onClick={() => go("Revision queue")}
                  >
                    Open your revision queue <ArrowRight size={16} />
                  </button>
                </section>
              </div>
              <div className="home-foot">
                <span>
                  <ShieldCheck size={16} />
                  Clarity before speed. Understanding before repetition.
                </span>
                <button onClick={() => go("Sources")}>
                  Our source promise <ArrowUpRight size={14} />
                </button>
              </div>
            </>
          )}
          {view === "Practice" && (
            <div className="practice-layout">
              <section className="practice-main">
                {!session && (
                  <div className="intro-panel">
                    <Compass size={30} />
                    <h2>Practice with a purpose.</h2>
                    <p>{r.reason}</p>
                    <div className="mode-options">
                      <button
                        className="primary"
                        onClick={() => start("repair")}
                      >
                        Start adaptive practice <ArrowRight size={18} />
                      </button>
                      <button
                        className="secondary"
                        onClick={() => start("timed")}
                      >
                        Practice with a timer
                      </button>
                    </div>
                    <p className="small-muted">
                      This first module includes 10 source-backed generated
                      questions. Authentic PYQs are held separately for
                      verification.
                    </p>
                  </div>
                )}
                {session?.completed && !result && (
                  <div className="completion">
                    <span className="complete-icon">
                      <CheckCircle2 size={34} />
                    </span>
                    <span className="eyebrow">Session complete</span>
                    <h2>
                      {s.improved
                        ? "The distinction is getting clearer."
                        : "You have a clearer next step."}
                    </h2>
                    <p>
                      {s.improved
                        ? `Recent accuracy is ${s.recent}%. We’ll reduce immediate repetition and check your recall later.`
                        : "The next revision targets the same distinction after a delay. Use the comparison if it still feels uncertain."}
                    </p>
                    <div className="metrics">
                      {metric(
                        "This session",
                        `${liveSession.filter((a) => a.correct).length}/${liveSession.length}`,
                        "Correct answers",
                      )}
                      {metric(
                        "Recall scheduled",
                        date(learner.revisions[0]?.due || Date.now()),
                        learner.revisions[0]?.intervalDays === 0
                          ? "After a 15-minute gap"
                          : "Spaced retrieval",
                      )}
                    </div>
                    <div className="mode-options">
                      <button
                        className="primary"
                        onClick={() => go("Performance")}
                      >
                        See performance update <ArrowRight size={18} />
                      </button>
                      <button
                        className="secondary"
                        onClick={() => go("Revision queue")}
                      >
                        View revision plan
                      </button>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => start("mixed")}
                    >
                      Choose more practice anyway
                    </button>
                  </div>
                )}
                {compare && !result && (
                  <>
                    {comparisonPanel()}
                    <div className="action-bar">
                      <span>Compare first. Then recall without the note.</span>
                      <button
                        className="primary"
                        onClick={() => {
                          setCompare(false);
                          event("comparison_opened", q?.id);
                        }}
                      >
                        Try the distinction <ArrowRight size={17} />
                      </button>
                    </div>
                  </>
                )}
                {q && !compare && (!session?.completed || result) && (
                  <div className="question-panel">
                    <div className="question-toolbar">
                      <span className="source-tag">
                        {q.sourceStatus.toLowerCase()}
                      </span>
                      <button
                        className={
                          learner.bookmarks.includes(q.id)
                            ? "icon-button bookmarked"
                            : "icon-button"
                        }
                        aria-label={
                          learner.bookmarks.includes(q.id)
                            ? "Remove bookmark"
                            : "Bookmark question"
                        }
                        onClick={() => bookmark(q.id)}
                      >
                        <Bookmark size={19} />
                      </button>
                    </div>
                    <div className="question-meta">
                      <span>Employment safeguards</span>
                      <span>{q.model}</span>
                      {session?.kind === "timed" && (
                        <span>
                          <Clock size={14} />
                          {elapsed}s
                        </span>
                      )}
                    </div>
                    <h2>{q.prompt}</h2>
                    <fieldset className="options" disabled={!!result || busy}>
                      <legend className="sr-only">Choose one answer</legend>
                      {q.options
                        .map((o, i) => ({ o, i }))
                        .sort(
                          (a, b) =>
                            displayPosition(q, a.i) - displayPosition(q, b.i),
                        )
                        .map(({ o, i }) => (
                          <label
                            key={o.text}
                            className={`option ${selected === i ? "chosen" : ""} ${result && i === q.answer ? "correct" : ""} ${result && result.selected === i && !result.correct ? "incorrect" : ""}`}
                          >
                            <input
                              type="radio"
                              name="answer"
                              checked={
                                (result ? result.selected : selected) === i
                              }
                              onChange={() => choose(i)}
                            />
                            <span className="option-letter">
                              {answerLetter(q, i)}
                            </span>
                            <span>{o.text}</span>
                            {result && i === q.answer && (
                              <Check size={19} />
                            )}{" "}
                            {result &&
                              result.selected === i &&
                              !result.correct && <X size={19} />}
                          </label>
                        ))}
                    </fieldset>
                    {!result ? (
                      <>
                        <div className="confidence-row">
                          <div>
                            <b>How sure are you?</b>
                            <small>
                              Helps us distinguish recall from a guess.
                            </small>
                          </div>
                          <div role="group" aria-label="Answer confidence">
                            {[
                              [35, "Unsure"],
                              [60, "Fairly sure"],
                              [85, "Confident"],
                            ].map(([v, label]) => (
                              <button
                                className={
                                  confidence === v
                                    ? "confidence selected"
                                    : "confidence"
                                }
                                aria-pressed={confidence === v}
                                key={v}
                                onClick={() => {
                                  setConfidence(Number(v));
                                  event("confidence_selected", q.id, String(v));
                                }}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>
                        {hint && (
                          <div className="hint">
                            <Lightbulb size={17} />
                            {q.hint}
                          </div>
                        )}
                        <div className="submit-row">
                          <button
                            className="text-button"
                            onClick={() => {
                              setHint(true);
                              event("hint_requested", q.id);
                            }}
                          >
                            <Lightbulb size={16} />{" "}
                            {hint ? "Hint shown" : "A small hint"}
                          </button>
                          <button
                            className="primary"
                            disabled={
                              selected === null || confidence === null || busy
                            }
                            onClick={submit}
                          >
                            {busy ? "Saving…" : "Check answer"}
                            <ArrowRight size={18} />
                          </button>
                        </div>
                        <p className="exposure">
                          {pretty(
                            learner.attempts.filter(
                              (a) => a.questionId === q.id,
                            ).length + 1,
                          )}{" "}
                          exposure · Answers and confidence are saved with your
                          learning profile.
                        </p>
                      </>
                    ) : (
                      <>
                        <div
                          className={
                            result.correct
                              ? "answer-feedback good"
                              : "answer-feedback attention"
                          }
                          role="status"
                        >
                          <div>
                            {result.correct ? (
                              <CheckCircle2 size={23} />
                            ) : (
                              <Lightbulb size={23} />
                            )}
                            <strong>
                              {result.correct
                                ? "Correct. Now check your reasoning."
                                : "Your answer is incorrect. Let us understand why."}
                            </strong>
                          </div>
                          <p>
                            {Math.round(result.seconds)} seconds ·{" "}
                            {result.hint ? "With a hint" : "Without a hint"} ·{" "}
                            {pretty(
                              learner.attempts.filter(
                                (a) => a.questionId === q.id,
                              ).length,
                            )}{" "}
                            exposure
                          </p>
                          {!result.correct && result.confidence >= 80 && (
                            <p>
                              You were confident in this answer. Compare the
                              specific provision before moving on.
                            </p>
                          )}
                          <p>
                            <b>Answer {answerLetter(q, q.answer)}:</b>{" "}
                            {q.options[q.answer].text}
                          </p>
                          <p>{q.reason}</p>
                        </div>
                        <TeacherExplanation
                          question={q}
                          selected={result.selected}
                          lesson={q.lessons[result.selected]}
                        />
                        <button
                          className="explain-toggle secondary"
                          onClick={() => {
                            setExplain(!explain);
                            event("explanation_opened", q.id);
                          }}
                        >
                          {explain
                            ? "Close extra details"
                            : "All options, memory tip & source"}
                          <ChevronDown size={17} />
                        </button>
                        {explain && (
                          <div className="explanations">
                            <div className="explanation-opening">
                              <h3>How to recognise this question</h3>
                              <p>{q.clue}</p>
                            </div>
                            {[
                              ["Examiner trap", q.trap],
                              ["Fast elimination", q.elimination],
                              ["Memory anchor", q.anchor],
                            ].map(([title, body]) => (
                              <details
                                key={title}
                                onToggle={(e) => {
                                  if (e.currentTarget.open)
                                    event(
                                      "explanation_section_opened",
                                      q.id,
                                      title,
                                    );
                                }}
                              >
                                <summary>
                                  {title}
                                  <ChevronDown size={17} />
                                </summary>
                                <p>{body}</p>
                              </details>
                            ))}
                            <details
                              onToggle={(e) => {
                                if (e.currentTarget.open)
                                  event(
                                    "explanation_section_opened",
                                    q.id,
                                    "Wrong option analysis",
                                  );
                              }}
                            >
                              <summary>
                                Why each option looks plausible
                                <ChevronDown size={17} />
                              </summary>
                              {q.options.map((o, i) => (
                                <div className="option-analysis" key={o.text}>
                                  <b>
                                    {answerLetter(q, i)}. {o.text}{" "}
                                    {i === q.answer ? "— correct" : ""}
                                  </b>
                                  <p>
                                    <span>Why it attracts:</span> {o.attraction}
                                  </p>
                                  <p>{o.why}</p>
                                </div>
                              ))}
                            </details>
                            <details
                              onToggle={(e) => {
                                if (e.currentTarget.open)
                                  event("comparison_opened", q.id);
                              }}
                            >
                              <summary>
                                Compare the confusing concepts
                                <GitCompareArrows size={18} />
                              </summary>
                              {comparisonPanel()}
                            </details>
                            <details>
                              <summary>
                                Source & question integrity
                                <ShieldCheck size={18} />
                              </summary>
                              <p>
                                {q.sourceStatus === "VERIFIED PYQ"
                                  ? "This question is linked to a verified paper and answer key in the source registry."
                                  : "This is authored practice, not an authenticated previous-year question. Its answer comes from the cited factual source."}
                              </p>
                              <p>
                                {q.source}. PDF page {q.page}.
                              </p>
                              {q.id.startsWith("TM-Q") && (
                                <a
                                  href={`${sourceUrl}#page=${q.page}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Read the historical source{" "}
                                  <ExternalLink size={14} />
                                </a>
                              )}
                              {q.id === "TM-Q005" && (
                                <p>
                                  <a
                                    href="https://www.telangana.gov.in/departments/legislative-affairs/"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    State formation reference
                                  </a>
                                </p>
                              )}
                            </details>
                            <div className="revision-inline">
                              <CalendarDays size={19} />
                              <p>
                                <b>
                                  Revision scheduled for{" "}
                                  {date(learner.revisions[0].due)}
                                </b>
                                <br />
                                {learner.revisions[0].reason}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="submit-row">
                          <span className="small-muted">
                            {!result.correct
                              ? "Next: another wording of this distinction."
                              : "Your next step uses this result."}
                          </span>
                          <button className="primary" onClick={nextQuestion}>
                            {session?.completed
                              ? "Finish session"
                              : "Next question"}
                            <ArrowRight size={18} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </section>
              <aside className="practice-aside">
                <span className="eyebrow">Your practice path</span>
                <h3>Clarity, then recall.</h3>
                <p>Employment safeguards</p>
                <div className="progress-track">
                  <i
                    style={{
                      width: `${session ? (session.index / session.queue.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <small>
                  {session
                    ? `${session.index} of ${session.queue.length} completed`
                    : "A plan shaped by your answers"}
                </small>
                <div className="path-list">
                  {[
                    "Compare the two frameworks",
                    "Recognise the right provision",
                    "Apply it in different models",
                    "Recall after a delay",
                  ].map((x, i) => (
                    <div key={x}>
                      <span>{i + 1}</span>
                      {x}
                    </div>
                  ))}
                </div>
                <div className="aside-note">
                  <ShieldCheck size={20} />
                  <b>No made-up PYQs.</b>
                  <p>
                    These questions are generated practice. Source notes stay
                    attached to every explanation.
                  </p>
                </div>
                <button className="text-button" onClick={() => go("Home")}>
                  <PanelLeftClose size={16} />
                  Pause and return home
                </button>
              </aside>
            </div>
          )}
          {view === "Topic map" && (
            <>
              <div className="info-banner">
                <BookOpen size={20} />
                <p>
                  Three syllabus phases, with a detailed study taxonomy. The
                  safeguards module is available now; other topics remain
                  unassessed until reviewed question sets are added.
                </p>
              </div>
              {topics.map((t) => {
                const availableTopics = new Set([
                  "TM-01.01", "TM-01.02", "TM-01.03", "TM-01.04", "TM-01.05",
                  "TM-02.01", "TM-02.02", "TM-02.03", "TM-02.04",
                  "TM-03.01", "TM-03.02", "TM-03.03", "TM-03.04", "TM-03.05",
                ]);
                return (
                <section className="topic-phase" key={t.id}>
                  <div className="phase-title">
                    <span>{t.period}</span>
                    <h2>{t.title}</h2>
                    <small>{t.id}</small>
                  </div>
                  {t.children.map(([id, title]) => (
                    <button
                      className={`topic-row ${availableTopics.has(id) ? "available" : ""}`}
                      key={id}
                      onClick={() => {
                        setTopic(topic === id ? null : id);
                        event("topic_opened", id);
                      }}
                    >
                      <span className="topic-dot">
                        {availableTopics.has(id) ? <Compass size={16} /> : null}
                      </span>
                      <div>
                        <b>{title}</b>
                        <small>
                          {topic === id
                            ? availableTopics.has(id)
                              ? "Recognition, chronology, statements and provision practice available"
                              : "In the taxonomy. Scored content awaits source review."
                            : id === "TM-02.01"
                              ? "Available · your current focus"
                              : availableTopics.has(id)
                                ? "Available · verified exam practice"
                                : "Content review pending"}
                        </small>
                      </div>
                      <span className="topic-status">
                        {id === "TM-02.01"
                          ? s.status.replaceAll("_", " ").toLowerCase()
                          : availableTopics.has(id)
                            ? "ready"
                            : "Not assessed"}
                      </span>
                      <ChevronDown size={17} />
                    </button>
                  ))}
                  {topic === "TM-02.01" && t.id === "TM-02" && (
                    <div className="topic-detail">
                      {comparisonPanel()}
                      <button
                        className="primary"
                        onClick={() => start("repair")}
                      >
                        Practice this topic <ArrowRight size={17} />
                      </button>
                    </div>
                  )}
                </section>
                );
              })}
              <a
                className="source-link"
                href={`${syllabusUrl}#page=33`}
                target="_blank"
                rel="noreferrer"
              >
                Syllabus baseline: official 2022 SI notification, pages 33 and
                35 <ExternalLink size={14} />
              </a>
            </>
          )}
          {view === "Performance" && (
            <>
              <div className="metrics metrics-panel">
                {metric(
                  "First attempt",
                  s.total ? `${s.first}%` : "Not tested",
                  "First response to each question",
                )}
                {metric(
                  "Recent accuracy",
                  s.total ? `${s.recent}%` : "Not tested",
                  "Last eight attempts",
                )}
                {metric(
                  "Median answer time",
                  s.total ? `${Math.round(s.median)}s` : "Not tested",
                  "Visible-page time for new attempts",
                )}
                {metric(
                  "High-confidence errors",
                  String(s.highConfidenceWrong),
                  "Review these before adding speed",
                )}
              </div>
              <div className="analytics-grid">
                <section className="panel">
                  <div className="section-heading">
                    <h2>Question-model mastery</h2>
                    <Layers3 size={20} />
                  </div>
                  <p>
                    Knowing a fact and recognising a model are different skills.
                  </p>
                  {s.models.map((m) => (
                    <div className="model-row" key={m.model}>
                      <div>
                        <b>{m.model}</b>
                        <small>
                          {m.count
                            ? `${m.count} attempts · ${m.seconds}s average`
                            : "Not yet assessed"}
                        </small>
                      </div>
                      <div className="model-bar">
                        <i style={{ width: `${m.accuracy}%` }} />
                      </div>
                      <strong>{m.count ? `${m.accuracy}%` : "—"}</strong>
                    </div>
                  ))}
                  <button
                    className="text-button"
                    onClick={() => start("mixed")}
                  >
                    Work on these models <ArrowRight size={16} />
                  </button>
                </section>
                <section className="panel">
                  <h2>The confusion to untangle</h2>
                  <div className="confusion-connection">
                    <span>Mulki Rules</span>
                    <GitCompareArrows size={25} />
                    <span>Six-Point Formula</span>
                  </div>
                  <p>
                    {s.confusion} wrong selections point to the paired concept.
                    This is evidence of possible confusion, not a diagnosis of
                    your thinking.
                  </p>
                  <div className="status-line">
                    <span className="status-dot" />
                    {s.status.replaceAll("_", " ").toLowerCase()}
                  </div>
                  <p>
                    {s.improved
                      ? `${learner.demo ? "Demo baseline: 40%. " : " "}Current recent accuracy: ${s.recent}%. Further spaced recalls are needed before stable mastery.`
                      : "A brief comparison, then changed wording, will test whether the distinction is clearer."}
                  </p>
                  <button className="secondary" onClick={() => start("repair")}>
                    Review this distinction
                  </button>
                </section>
              </div>
              <div className="analytics-grid">
                <section className="panel">
                  <h2>Confidence & independence</h2>
                  <dl className="fact-list">
                    <div>
                      <dt>Confidence calibration</dt>
                      <dd>{s.confidence}%</dd>
                    </div>
                    <div>
                      <dt>Without hints</dt>
                      <dd>{s.independent}% accuracy</dd>
                    </div>
                    <div>
                      <dt>Hint-assisted answers</dt>
                      <dd>
                        {learner.attempts.filter((a) => a.hint).length} attempts
                      </dd>
                    </div>
                    <div>
                      <dt>Retry accuracy</dt>
                      <dd>{s.retry}%</dd>
                    </div>
                    <div>
                      <dt>Retention</dt>
                      <dd>
                        {s.retention === null
                          ? "Awaiting a recall test"
                          : `${s.retention}%`}
                      </dd>
                    </div>
                  </dl>
                  <p className="small-muted">
                    Calibration is 100 minus the average confidence–outcome gap.
                    It is a coaching heuristic, not a validated ability score.
                  </p>
                </section>
                <section className="panel">
                  <h2>Your latest attempts</h2>
                  <div className="attempt-dots">
                    {learner.attempts.slice(-16).map((a, i) => (
                      <span
                        key={a.id}
                        className={
                          a.correct ? "dot correct-dot" : "dot wrong-dot"
                        }
                        title={`${i + 1}: ${a.correct ? "correct" : "incorrect"}`}
                      >
                        {a.correct ? <Check size={16} /> : <X size={16} />}
                      </span>
                    ))}
                  </div>
                  <p>
                    {s.decline
                      ? "Accuracy dropped across the last eight attempts compared with the eight before them. A short reset may help."
                      : "Each mark is a saved attempt. We need enough comparable attempts before describing a trend."}
                  </p>
                  <button
                    className="text-button"
                    onClick={() => go("Learning history")}
                  >
                    Open attempt history <ArrowRight size={16} />
                  </button>
                </section>
              </div>
            </>
          )}
          {view === "Revision queue" && (
            <>
              <div className="info-banner">
                <CalendarDays size={22} />
                <p>
                  Retrieval timing changes with correctness, hints and
                  independent improvement. You can override the recommendation
                  and practice early.
                </p>
              </div>
              {learner.revisions.length ? (
                learner.revisions.map((item) => (
                  <section
                    className="revision-item panel"
                    key={item.questionId}
                  >
                    <div className="revision-date">
                      <CalendarDays size={24} />
                      <b>{date(item.due)}</b>
                      <small>
                        {item.due <= Date.now()
                          ? "Due now"
                          : new Date(item.due).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                      </small>
                    </div>
                    <div>
                      <span className="eyebrow">One focused recall</span>
                      <h2>Mulki Rules & Six-Point Formula</h2>
                      <p>{item.reason}</p>
                      <small>
                        Changed wording · no note before answering · one
                        question
                      </small>
                    </div>
                    <button className="primary" onClick={() => start("recall")}>
                      {item.due <= Date.now()
                        ? "Start recall"
                        : "Practice early"}
                      <ArrowRight size={17} />
                    </button>
                  </section>
                ))
              ) : (
                <div className="empty">
                  <h2>Your revision queue begins with an attempt.</h2>
                  <p>Answer a question so we can set a useful recall time.</p>
                  <button
                    className="primary"
                    onClick={() => start("foundation")}
                  >
                    Start practice
                  </button>
                </div>
              )}
            </>
          )}
          {view === "Mistake book" && (
            <>
              <div className="section-heading">
                <p>
                  {wrong.length} saved mistakes. Repair the pattern, not the
                  whole chapter.
                </p>
                <button className="secondary" onClick={() => start("repair")}>
                  Repair this concept <ArrowRight size={16} />
                </button>
              </div>
              {wrong.length ? (
                wrong
                  .slice()
                  .reverse()
                  .map((a) => {
                    const item = questions.find(
                      (q) =>
                        q.id === a.questionId &&
                        q.version === (a.questionVersion || 1),
                    );
                    if (!item) return null;
                    return (
                      <details className="mistake-item" key={a.id}>
                        <summary>
                          <span className="mistake-marker">
                            <Flag size={18} />
                          </span>
                          <span>
                            <b>{item.prompt}</b>
                            <small>
                              {classify(a, item)} ·{" "}
                              {a.demo ? "Demo history" : date(a.at)}
                            </small>
                          </span>
                          <ChevronDown size={18} />
                        </summary>
                        <div className="mistake-content">
                          <p>
                            <b>You chose:</b> {item.options[a.selected].text}
                          </p>
                          <TeacherExplanation
                            question={item}
                            selected={a.selected}
                            lesson={item.lessons[a.selected]}
                          />
                          <button
                            className="text-button"
                            onClick={() => start("repair")}
                          >
                            Try a targeted follow-up <ArrowRight size={16} />
                          </button>
                        </div>
                      </details>
                    );
                  })
              ) : (
                <div className="empty">
                  <CheckCircle2 size={28} />
                  <h3>No mistakes recorded yet.</h3>
                  <p>
                    When a wrong answer reveals a useful distinction, it will
                    appear here.
                  </p>
                </div>
              )}
            </>
          )}
          {view === "Mentor" && (
            <div className="mentor-layout">
              <section className="mentor-card">
                <div className="mentor-avatar">
                  <GraduationCap size={30} />
                </div>
                <span className="eyebrow">Your study mentor</span>
                <h2>
                  {s.improved
                    ? "Now let time test your understanding."
                    : s.total
                      ? "Compare the provision, not just the theme."
                      : "Let’s find your starting point."}
                </h2>
                <p>{r.reason}</p>
                <div className="mentor-evidence">
                  <b>What this recommendation uses</b>
                  <ul>
                    <li>
                      {s.total} recorded attempts, including{" "}
                      {learner.attempts.filter((a) => a.demo).length} explicitly
                      seeded demo attempts.
                    </li>
                    <li>
                      {s.confusion} incorrect selections of the paired concept.
                    </li>
                    <li>
                      {s.highConfidenceWrong} high-confidence wrong answers.
                    </li>
                    <li>{s.live} attempts from your own practice.</li>
                  </ul>
                </div>
                <p>
                  {s.improved
                    ? "You can move on. A later retrieval will check whether the improvement lasts."
                    : "Before adding speed, look for the specific clue: residence rules, or the broader replacement framework."}
                </p>
                <button className="primary" onClick={nextAction}>
                  {r.action}
                  <ArrowRight size={17} />
                </button>
              </section>
              <aside className="panel">
                <h3>A useful 40-minute study session</h3>
                <ol className="study-routine">
                  <li>
                    <b>8 minutes: recall older topics.</b>
                    <span>
                      Try due questions before reading notes. Say the answer in
                      your own words first.
                    </span>
                  </li>
                  <li>
                    <b>12 minutes: learn one small concept.</b>
                    <span>
                      Ask: what was the problem, what was proposed, and what
                      changed? Place it on the timeline.
                    </span>
                  </li>
                  <li>
                    <b>12 minutes: practise different question forms.</b>
                    <span>
                      Try direct facts, statements, order of events and NOT
                      questions. Compare the exact provision when two options
                      look similar.
                    </span>
                  </li>
                  <li>
                    <b>8 minutes: close the notes and recall.</b>
                    <span>
                      Explain your main mistake without looking. Leave the next
                      check for a later session.
                    </span>
                  </li>
                </ol>
                <p className="routine-note">
                  This is a suggested starting routine. Use shorter sessions if
                  needed. Reviewed content is currently available for one
                  concept family.
                </p>
                <h3>You stay in control.</h3>
                <p>
                  The mentor uses saved learning evidence and reviewed content.
                  It does not infer your mental state or invent historical
                  answers.
                </p>
                <button className="list-row" onClick={() => go("Performance")}>
                  Show my evidence <ArrowRight size={16} />
                </button>
                <button
                  className="list-row"
                  onClick={() => go("Revision queue")}
                >
                  Show my recall plan <ArrowRight size={16} />
                </button>
                <button className="list-row" onClick={() => start("mixed")}>
                  Choose a different practice mode <ArrowRight size={16} />
                </button>
                <small>
                  Rule-based guidance · no external AI service connected
                </small>
              </aside>
            </div>
          )}
          {view === "Papers" && (
            <>
              <div className="tabs" role="group" aria-label="Exam papers">
                {["SI", "Constable"].map((p) => (
                  <button
                    key={p}
                    className={paper === p ? "active" : ""}
                    onClick={() => setPaper(p)}
                  >
                    {p === "SI" ? "Sub-Inspector" : "Constable"} papers
                  </button>
                ))}
              </div>
              <section className="panel paper-panel">
                <FileText size={36} />
                <h2>
                  {paper === "SI"
                    ? "TS Police SI · 2016"
                    : "Constable paper collection"}
                </h2>
                <span className="amber-label">
                  {paper === "SI"
                    ? "Source partially verified"
                    : "Awaiting verified source papers"}
                </span>
                <p>
                  {paper === "SI"
                    ? "A paper PDF exists in the research workspace. Its official provenance and final key have not yet been fully authenticated. It is available for source inspection, not scored as a verified PYQ set."
                    : "No Constable paper and official answer-key pair has been verified for this release. Generated questions are available separately for concept practice."}
                </p>
                {paper === "SI" && (
                  <a
                    className="secondary"
                    href="/api/paper"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Inspect source paper <ExternalLink size={16} />
                  </a>
                )}
                <div className="source-policy">
                  <ShieldCheck size={21} />
                  <p>
                    Full-paper scoring and exam simulation unlock only after
                    question text and the official key are verified. We will not
                    fill those modes with invented PYQs.
                  </p>
                </div>
                <button className="text-button" onClick={() => start("timed")}>
                  Use timed generated practice <ArrowRight size={16} />
                </button>
              </section>
            </>
          )}
          {view === "Bookmarks" && (
            <>
              {topic && questions.some((q) => q.id === topic)
                ? (() => {
                    const item = questions.find((q) => q.id === topic)!;
                    return (
                      <section className="panel">
                        <span className="source-tag">
                          {item.sourceStatus.toLowerCase()}
                        </span>
                        <h2>{item.prompt}</h2>
                        <p>{item.reason}</p>
                        <TeacherExplanation
                          question={item}
                          selected={item.answer}
                          lesson={item.lessons[item.answer]}
                        />
                        <div className="memory">
                          <Lightbulb size={20} />
                          {item.anchor}
                        </div>
                        <p>{item.source}</p>
                        <div className="mode-options">
                          <button
                            className="primary"
                            onClick={() => start("mixed")}
                          >
                            Test the concept
                          </button>
                          <button
                            className="secondary"
                            onClick={() => bookmark(item.id)}
                          >
                            {learner.bookmarks.includes(item.id)
                              ? "Remove bookmark"
                              : "Save question"}
                          </button>
                        </div>
                      </section>
                    );
                  })()
                : questionList(
                    library.filter((q) => learner.bookmarks.includes(q.id)),
                  )}
              {!topic && (
                <div className="library-pagination">
                  <span>
                    {libraryError ||
                      (libraryLoading
                        ? "Loading saved questions…"
                        : `${libraryTotal} saved questions`)}
                  </span>
                  <button
                    className="secondary"
                    disabled={libraryOffset === 0 || libraryLoading}
                    onClick={() =>
                      setLibraryOffset(Math.max(0, libraryOffset - 20))
                    }
                  >
                    Previous
                  </button>
                  <button
                    className="secondary"
                    disabled={
                      libraryOffset + 20 >= libraryTotal || libraryLoading
                    }
                    onClick={() => setLibraryOffset(libraryOffset + 20)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
          {view === "Learning history" && (
            <section className="panel">
              <div className="section-heading">
                <h2>Every attempt has a story.</h2>
                <span>{s.total} attempts</span>
              </div>
              {s.total > learner.attempts.length && (
                <p>
                  Showing your latest {learner.attempts.length} attempts. Your
                  complete history is available through Export my data in
                  Profile.
                </p>
              )}
              {learner.attempts
                .slice()
                .reverse()
                .map((a) => (
                  <div className="history-row" key={a.id}>
                    <span
                      className={
                        a.correct
                          ? "history-result good-text"
                          : "history-result amber-text"
                      }
                    >
                      {a.correct ? <Check size={19} /> : <X size={19} />}
                    </span>
                    <div>
                      <b>
                        {questions.find((q) => q.id === a.questionId)?.model}
                      </b>
                      <small>
                        {classify(
                          a,
                          questions.find((q) => q.id === a.questionId),
                        )}{" "}
                        · {a.demo ? "Seeded demo history" : date(a.at)}
                      </small>
                    </div>
                    <span>{Math.round(a.seconds)}s</span>
                    <span className="history-confidence">
                      {a.confidence}% confidence
                    </span>
                  </div>
                ))}
              {!s.total && <p>Your first practice session will appear here.</p>}
            </section>
          )}
          {view === "Search" && (
            <>
              <div className="search-field">
                <Search size={22} />
                <input
                  autoFocus
                  aria-label="Search learning content"
                  placeholder="Try ‘Mulki’, ‘chronology’ or ‘tribunal’"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setLibraryOffset(0);
                  }}
                />
              </div>
              <p>
                {search
                  ? "Matching practice questions"
                  : "Search reviewed practice content by concept, wording or model."}
              </p>
              {libraryLoading ? (
                <p role="status">Finding questions…</p>
              ) : libraryError ? (
                <p role="alert">{libraryError}</p>
              ) : (
                questionList(library)
              )}
              <div className="library-pagination">
                <span>{libraryTotal} available questions</span>
                <button
                  className="secondary"
                  disabled={libraryOffset === 0 || libraryLoading}
                  onClick={() =>
                    setLibraryOffset(Math.max(0, libraryOffset - 20))
                  }
                >
                  Previous
                </button>
                <button
                  className="secondary"
                  disabled={
                    libraryOffset + 20 >= libraryTotal || libraryLoading
                  }
                  onClick={() => setLibraryOffset(libraryOffset + 20)}
                >
                  Next
                </button>
              </div>
            </>
          )}
          {view === "Profile" && (
            <section className="panel settings-panel">
              <h2>Your Exam, Your Personal Instance</h2>
              {data?.user ? (
                <div
                  style={{
                    marginBottom: 24,
                    padding: "18px 22px",
                    background: "var(--mint)",
                    borderRadius: "10px",
                    border: "1px solid #d4decc",
                  }}
                >
                  <b
                    style={{
                      display: "block",
                      color: "var(--teal-dark)",
                      fontSize: 16,
                    }}
                  >
                    {data.user.name}
                  </b>
                  <span
                    style={{
                      display: "block",
                      color: "#56685d",
                      fontSize: 13,
                      marginTop: 4,
                    }}
                  >
                    {data.user.email} · Authenticated Student Instance
                  </span>
                  <div style={{ marginTop: 14 }}>
                    <button className="secondary" onClick={handleLogout}>
                      Log Out of Account
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    marginBottom: 24,
                    padding: "18px 22px",
                    background: "#fef8ee",
                    borderRadius: "10px",
                    border: "1px solid #f6e3c5",
                  }}
                >
                  <b
                    style={{
                      display: "block",
                      color: "#8a581e",
                      fontSize: 15,
                    }}
                  >
                    Create your personal account
                  </b>
                  <p
                    style={{
                      margin: "6px 0 14px",
                      fontSize: 13,
                      color: "#6b583f",
                      lineHeight: 1.6,
                    }}
                  >
                    Every user gets their own dedicated study instance. Sign in
                    or register to preserve your accuracy, mistake revisions,
                    and attempts across all your devices.
                  </p>
                  <button
                    className="primary"
                    onClick={() => {
                      setAuthMode("register");
                      setAuthError(null);
                      setAuthOpen(true);
                    }}
                  >
                    Create Free Account
                  </button>
                  <button
                    className="secondary"
                    style={{ marginLeft: 10 }}
                    onClick={() => {
                      setAuthMode("login");
                      setAuthError(null);
                      setAuthOpen(true);
                    }}
                  >
                    Sign In
                  </button>
                </div>
              )}
              <label htmlFor="exam-target">Exam target</label>
              <select
                id="exam-target"
                value={data?.user ? data.user.target : learner.target}
                onChange={async (e) => {
                  const target = e.target.value as "SI" | "Constable";
                  if (data?.user) {
                    try {
                      await fetch("/api/auth", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "target", target }),
                      });
                    } catch {}
                  }
                  send({ action: "target", target });
                }}
              >
                <option value="SI">Telangana Police Sub-Inspector</option>
                <option value="Constable">Telangana Police Constable</option>
              </select>
              <h3>
                {data?.user
                  ? "Your personal learning database"
                  : learner.demo
                    ? "You are exploring the demo learner."
                    : "You are using a fresh learning profile."}
              </h3>
              <p>
                {data?.user
                  ? "All your question attempts, time per question, confidence scores, and mistake book entries are permanently persisted to your user account."
                  : "The demo starts with five labelled attempts: two repeated concept-confusion errors, a correct but slow response, a statement error and another correct response. Your new attempts are stored separately from those seed labels."}
              </p>
              {!data?.user && (
                <div className="mode-options">
                  <button
                    className="primary"
                    disabled={busy}
                    onClick={async () => {
                      const next = await send({ action: "profile", demo: false });
                      if (next) go("Home");
                    }}
                  >
                    Start a fresh learner
                  </button>
                  <button
                    className="secondary"
                    disabled={busy}
                    onClick={async () => {
                      const next = await send({ action: "profile", demo: true });
                      if (next) go("Home");
                    }}
                  >
                    Open a new demo learner
                  </button>
                </div>
              )}
              <p className="small-muted">
                {data?.user
                  ? "Authenticated and securely synced to your dedicated database record."
                  : "Creates a new local profile without deleting the previous data. Sign in to link across devices."}
              </p>
              <hr />
              <h3>Your learning collection</h3>
              <div className="profile-collection">
                {(
                  [
                    "Topic map",
                    "Mistake book",
                    "Revision queue",
                    "Performance",
                    "Bookmarks",
                    "Learning history",
                    "Sources",
                  ] as View[]
                ).map((item) => (
                  <button key={item} onClick={() => go(item)}>
                    {item}
                    <ChevronRight size={16} />
                  </button>
                ))}
              </div>
              <h3>Your data stays in this local app.</h3>
              <p>
                We save answers, confidence, hints, answer changes, elapsed
                active time, revision plans and limited page events. No camera,
                microphone, keystroke logging or third-party tracking is used.
              </p>
              <a className="secondary" href="/api/export" download>
                Export my learning data <ArrowUpRight size={16} />
              </a>
            </section>
          )}
          {view === "Sources" && (
            <section className="panel sources-panel">
              <ShieldCheck size={32} />
              <h2>Trust the source. Understand the label.</h2>
              <p>
                The practice library currently contains {data.corpus.published}{" "}
                published questions.{" "}
                {data.corpus.statuses
                  .map((x) => `${x.count} ${x.status.toLowerCase()}`)
                  .join("; ")}
                . Generated questions teach the underlying facts; they are not
                presented as authentic examination questions.
              </p>
              <div className="source-record">
                <b>Srikrishna Committee report · 2010</b>
                <p>
                  Chapter 1, §1.2.27, and chapter 5, §5.2.01–5.2.03. The
                  comparison is based on the report’s account of historical
                  Mulki rules and the Six-Point Formula.
                </p>
                <a href={sourceUrl} target="_blank" rel="noreferrer">
                  Ministry of Home Affairs source <ExternalLink size={15} />
                </a>
              </div>
              <div className="source-record">
                <b>Official SI syllabus · 2022 baseline</b>
                <p>
                  Pages 33 and 35 explicitly list the three Telangana movement
                  phases. The finer topic tree is an editorial breakdown, not an
                  official verbatim syllabus. Current notification and Constable
                  parity require separate verification before release.
                </p>
                <a href={syllabusUrl} target="_blank" rel="noreferrer">
                  Read official notification <ExternalLink size={15} />
                </a>
              </div>
              <div className="source-record">
                <b>Telangana Legislative Affairs</b>
                <p>
                  Formation date reference for the chronology practice question.
                </p>
                <a
                  href="https://www.telangana.gov.in/departments/legislative-affairs/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Telangana government source <ExternalLink size={15} />
                </a>
              </div>
              <h3>Held for review</h3>
              <p>
                The SI 2016 PDF is not labelled “verified PYQ” without
                authenticated provenance and the final key. Disputed dates in
                the research manuscript are excluded from scored questions.
                Current-affairs and expected-question predictions are not
                manufactured.
              </p>
              <p className="small-muted">
                Content reviewed for this local slice on 1 October 2026. Human
                editorial sign-off remains a production release gate.
              </p>
            </section>
          )}
        </main>
        <footer className="app-footer">
          <span>Sadhana · Telangana Police preparation</span>
          <span>Learn the distinction. Keep the understanding.</span>
        </footer>
      </div>
      <nav className="bottom-nav" aria-label="Mobile navigation">
        {[
          { name: "Home", icon: House },
          { name: "Practice", icon: Compass },
          { name: "Papers", icon: FileText },
          { name: "Mentor", icon: MessageCircle },
          { name: "Profile", icon: Settings2 },
        ].map(({ name, icon: Icon }) => (
          <button
            key={name}
            className={view === name ? "active" : ""}
            onClick={() => go(name as View)}
          >
            <Icon size={21} />
            <span>{name}</span>
          </button>
        ))}
      </nav>
      {authOpen && (
        <div
          className="auth-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setAuthOpen(false);
          }}
        >
          <div className="auth-card" role="dialog" aria-modal="true">
            <button
              className="auth-close"
              aria-label="Close authentication dialog"
              onClick={() => setAuthOpen(false)}
            >
              <X size={18} />
            </button>
            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab ${authMode === "login" ? "active" : ""}`}
                onClick={() => {
                  setAuthMode("login");
                  setAuthError(null);
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`auth-tab ${authMode === "register" ? "active" : ""}`}
                onClick={() => {
                  setAuthMode("register");
                  setAuthError(null);
                }}
              >
                Create Account
              </button>
            </div>
            {authError && <div className="auth-error">{authError}</div>}
            <form className="auth-form" onSubmit={handleAuthSubmit}>
              {authMode === "register" && (
                <div className="auth-field">
                  <label htmlFor="auth-name">Full Name</label>
                  <input
                    id="auth-name"
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                  />
                </div>
              )}
              <div className="auth-field">
                <label htmlFor="auth-email">Email Address</label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                />
              </div>
              <div className="auth-field">
                <label htmlFor="auth-password">Password</label>
                <input
                  id="auth-password"
                  type="password"
                  required
                  placeholder={
                    authMode === "register"
                      ? "Minimum 6 characters"
                      : "Enter your password"
                  }
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                />
              </div>
              {authMode === "register" && (
                <div className="auth-field">
                  <label htmlFor="auth-target">Target Examination</label>
                  <select
                    id="auth-target"
                    value={authTarget}
                    onChange={(e) =>
                      setAuthTarget(e.target.value as "SI" | "Constable")
                    }
                  >
                    <option value="SI">
                      Telangana Police Sub-Inspector (SI)
                    </option>
                    <option value="Constable">
                      Telangana Police Constable
                    </option>
                  </select>
                </div>
              )}
              <button
                type="submit"
                className="auth-submit"
                disabled={authBusy}
              >
                {authBusy
                  ? "Please wait..."
                  : authMode === "login"
                    ? "Sign In to My Instance"
                    : "Create My Account"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

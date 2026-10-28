"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type OptionKey = "A" | "B" | "C" | "D";

type Question = {
  id: number;
  prompt: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  explanation: string;
  source: string;
};

type SessionUser = {
  id: string;
  username: string;
};

const OPTIONS: Array<{ key: OptionKey; field: keyof Question }> = [
  { key: "A", field: "optionA" },
  { key: "B", field: "optionB" },
  { key: "C", field: "optionC" },
  { key: "D", field: "optionD" },
];

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<SessionUser | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [queueCount, setQueueCount] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const currentQuestion = useMemo(() => questions[index] ?? null, [questions, index]);

  const fetchQuestions = useCallback(async (mode: "mistakes" | "all" = "mistakes") => {
    const response = await fetch(`/api/questions?mode=${mode}&limit=10`, { cache: "no-store" });
    if (!response.ok) {
      setUser(null);
      setQuestions([]);
      return;
    }

    const data = await response.json();
    setUser(data.user);
    setQueueCount(data.queueCount);
    setQuestions(data.questions);
    setIndex(0);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchQuestions();
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [fetchQuestions]);

  async function handleAuth(action: "register" | "login") {
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`/api/auth/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error ?? "Authentication failed.");
        return;
      }

      setUser(data.user);
      setPassword("");
      await fetchQuestions();
    } finally {
      setLoading(false);
    }
  }

  async function handleAnswer(selected: OptionKey) {
    if (!currentQuestion) {
      return;
    }

    const response = await fetch("/api/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: currentQuestion.id, selected }),
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error ?? "Failed to submit answer.");
      return;
    }

    const verdict = data.correct ? "✅ Correct" : `❌ Wrong (Answer: ${data.answer})`;
    setMessage(`${verdict} — ${data.explanation}`);

    if (index + 1 < questions.length) {
      setIndex((value) => value + 1);
    } else {
      await fetchQuestions("all");
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setQuestions([]);
    setMessage("Logged out.");
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Telangana Movement Smart PYQ Platform</h1>
      <p>
        Next.js 16 + TypeScript + SQLite practice system for Telangana Police SI/Constable prep with per-user
        isolation, scrypt authentication, and spaced-repetition mistake review.
      </p>

      {!user ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleAuth("login");
          }}
          style={{ display: "grid", gap: "0.75rem", maxWidth: 400 }}
        >
          <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Username" required />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password (8+ chars)"
            type="password"
            required
          />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="submit" disabled={loading}>
              Login
            </button>
            <button type="button" disabled={loading} onClick={() => void handleAuth("register")}>
              Register
            </button>
          </div>
        </form>
      ) : (
        <section style={{ display: "grid", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>Welcome, {user.username}</strong>
            <button onClick={() => void handleLogout()}>Logout</button>
          </div>
          <div>Pending mistake queue: {queueCount}</div>

          {currentQuestion ? (
            <article style={{ border: "1px solid #ddd", borderRadius: 8, padding: "1rem", display: "grid", gap: "0.75rem" }}>
              <div>
                <strong>Source:</strong> {currentQuestion.source}
              </div>
              <div>{currentQuestion.prompt}</div>
              {OPTIONS.map((option) => (
                <button key={option.key} onClick={() => void handleAnswer(option.key)} style={{ textAlign: "left" }}>
                  {option.key}. {String(currentQuestion[option.field])}
                </button>
              ))}
            </article>
          ) : (
            <p>No questions available right now.</p>
          )}
        </section>
      )}

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </main>
  );
}

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") ?? "all";
  const limit = Number(url.searchParams.get("limit") ?? 10);
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 50) : 10;

  const rows =
    mode === "mistakes"
      ? (
          await db.execute({
            sql: `
              SELECT q.id, q.prompt, q.option_a, q.option_b, q.option_c, q.option_d, q.explanation, q.source
              FROM mistake_queue mq
              JOIN questions q ON q.id = mq.question_id
              WHERE mq.user_id = ? AND mq.next_review_at <= ?
              ORDER BY mq.next_review_at ASC
              LIMIT ?
            `,
            args: [user.id, Date.now(), safeLimit],
          })
        ).rows
      : (
          await db.execute({
            sql: `
              SELECT id, prompt, option_a, option_b, option_c, option_d, explanation, source
              FROM questions
              ORDER BY RANDOM()
              LIMIT ?
            `,
            args: [safeLimit],
          })
        ).rows;

  const queueCountResult = await db.execute({
    sql: "SELECT COUNT(1) AS count FROM mistake_queue WHERE user_id = ?",
    args: [user.id],
  });

  return NextResponse.json({
    user,
    queueCount: Number(queueCountResult.rows[0]?.count ?? 0),
    questions: rows.map((row) => ({
      id: Number(row.id),
      prompt: String(row.prompt),
      optionA: String(row.option_a),
      optionB: String(row.option_b),
      optionC: String(row.option_c),
      optionD: String(row.option_d),
      explanation: String(row.explanation),
      source: String(row.source),
    })),
  });
}

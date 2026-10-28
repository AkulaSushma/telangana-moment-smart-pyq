import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { updateQueueOnCorrect, updateQueueOnWrong, type QueueState } from "@/lib/spaced-repetition";

export const runtime = "nodejs";

type OptionKey = "A" | "B" | "C" | "D";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { questionId, selected } = (await request.json()) as {
    questionId?: number;
    selected?: OptionKey;
  };

  if (!questionId || !selected || !["A", "B", "C", "D"].includes(selected)) {
    return NextResponse.json({ error: "questionId and selected option are required." }, { status: 400 });
  }

  const db = await getDb();
  const questionResult = await db.execute({
    sql: "SELECT answer, explanation FROM questions WHERE id = ? LIMIT 1",
    args: [questionId],
  });

  const question = questionResult.rows[0];

  if (!question) {
    return NextResponse.json({ error: "Question not found." }, { status: 404 });
  }

  const correctOption = String(question.answer) as OptionKey;
  const isCorrect = selected === correctOption;

  const queueResult = await db.execute({
    sql: `
      SELECT interval_days, streak, ease
      FROM mistake_queue
      WHERE user_id = ? AND question_id = ?
      LIMIT 1
    `,
    args: [user.id, questionId],
  });

  const queueRow = queueResult.rows[0];
  const previousState: QueueState | null = queueRow
    ? {
        intervalDays: Number(queueRow.interval_days),
        streak: Number(queueRow.streak),
        ease: Number(queueRow.ease),
      }
    : null;

  if (!isCorrect) {
    const next = updateQueueOnWrong(previousState);
    await db.execute({
      sql: `
        INSERT INTO mistake_queue (user_id, question_id, next_review_at, interval_days, streak, ease, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id, question_id) DO UPDATE SET
          next_review_at = excluded.next_review_at,
          interval_days = excluded.interval_days,
          streak = excluded.streak,
          ease = excluded.ease,
          updated_at = excluded.updated_at
      `,
      args: [
        user.id,
        questionId,
        next.nextReviewAt,
        next.intervalDays,
        next.streak,
        next.ease,
        Date.now(),
      ],
    });
  } else if (previousState) {
    const next = updateQueueOnCorrect(previousState);

    if (next.mastered) {
      await db.execute({
        sql: "DELETE FROM mistake_queue WHERE user_id = ? AND question_id = ?",
        args: [user.id, questionId],
      });
    } else {
      await db.execute({
        sql: `
          UPDATE mistake_queue
          SET next_review_at = ?, interval_days = ?, streak = ?, ease = ?, updated_at = ?
          WHERE user_id = ? AND question_id = ?
        `,
        args: [
          next.nextReviewAt,
          next.intervalDays,
          next.streak,
          next.ease,
          Date.now(),
          user.id,
          questionId,
        ],
      });
    }
  }

  return NextResponse.json({
    correct: isCorrect,
    answer: correctOption,
    explanation: String(question.explanation),
  });
}

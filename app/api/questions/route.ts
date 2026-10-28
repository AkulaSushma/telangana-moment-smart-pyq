import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { queryQuestions, readLearner } from "@/lib/db";
import { studyQuestion } from "@/lib/question-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const filters = z.object({
  query: z.string().max(160).optional(),
  offset: z.coerce.number().int().min(0).max(100000).default(0),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  bookmarks: z.enum(["true"]).optional(),
});
export async function GET(req: NextRequest) {
  const parsed = filters.safeParse(
    Object.fromEntries(req.nextUrl.searchParams),
  );
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid question filters." },
      { status: 400 },
    );
  const profile = readLearner(req.cookies.get("pyq_learner")?.value || "");
  if (!profile)
    return NextResponse.json(
      { error: "Open your learning profile first." },
      { status: 401 },
    );
  const { bookmarks, ...query } = parsed.data;
  const page = queryQuestions({
    ...query,
    ...(bookmarks ? { ids: profile.bookmarks } : {}),
  });
  return NextResponse.json(
    { ...page, items: page.items.map(studyQuestion) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

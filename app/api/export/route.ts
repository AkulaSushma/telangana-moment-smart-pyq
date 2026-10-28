import { NextRequest, NextResponse } from "next/server";
import { readLearner } from "@/lib/db";
export const runtime = "nodejs";
export async function GET(req: NextRequest) {
  const id = req.cookies.get("pyq_learner")?.value;
  const state = id ? readLearner(id) : null;
  if (!state)
    return NextResponse.json({ error: "No profile found." }, { status: 401 });
  return new Response(
    JSON.stringify(
      {
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        learner: state,
      },
      null,
      2,
    ),
    {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="sadhana-learning.json"',
        "Cache-Control": "no-store",
      },
    },
  );
}

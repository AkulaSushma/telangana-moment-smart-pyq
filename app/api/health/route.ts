import { NextResponse } from "next/server";
import { corpusCounts } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const summary = corpusCounts();
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || "development",
      database: {
        status: "connected",
        totalQuestions: summary.total,
        publishedQuestions: summary.published,
        sources: summary.sources,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Database connection error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}

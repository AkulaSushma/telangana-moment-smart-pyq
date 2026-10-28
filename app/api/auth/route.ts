import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getUserBySession,
  loginUser,
  logoutUser,
  registerUser,
  updateUserTarget,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure:
      process.env.NODE_ENV === "production" && process.env.PYQ_HTTPS === "true",
    path: "/",
    maxAge,
  };
}

export async function GET(req: NextRequest) {
  const sessionToken = req.cookies.get("pyq_session")?.value;
  const user = sessionToken ? getUserBySession(db, sessionToken) : null;
  return NextResponse.json({
    user: user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          target: user.target,
          createdAt: user.createdAt,
        }
      : null,
  });
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const expectedOrigin = `${new URL(req.url).protocol}//${req.headers.get("host")}`;
  if (origin && origin !== expectedOrigin) {
    return NextResponse.json(
      { error: "Request origin does not match." },
      { status: 403 },
    );
  }

  try {
    const body = await req.json();
    const action = body.action;

    if (action === "register") {
      const result = registerUser(db, {
        name: body.name,
        email: body.email,
        password: body.password,
        target: body.target,
      });

      const res = NextResponse.json({
        success: true,
        user: result.user,
        message: "Account registered successfully.",
      });

      res.cookies.set("pyq_session", result.sessionToken, cookieOptions(30 * 24 * 3600));
      res.cookies.set("pyq_learner", result.learnerId, cookieOptions(30 * 24 * 3600));
      return res;
    }

    if (action === "login") {
      const result = loginUser(db, {
        email: body.email,
        password: body.password,
      });

      const res = NextResponse.json({
        success: true,
        user: result.user,
        message: "Signed in successfully.",
      });

      res.cookies.set("pyq_session", result.sessionToken, cookieOptions(30 * 24 * 3600));
      res.cookies.set("pyq_learner", result.learnerId, cookieOptions(30 * 24 * 3600));
      return res;
    }

    if (action === "logout") {
      const sessionToken = req.cookies.get("pyq_session")?.value;
      if (sessionToken) {
        logoutUser(db, sessionToken);
      }

      const res = NextResponse.json({
        success: true,
        user: null,
        message: "Signed out successfully.",
      });

      res.cookies.set("pyq_session", "", cookieOptions(0));
      res.cookies.set("pyq_learner", "", cookieOptions(0));
      return res;
    }

    if (action === "target") {
      const sessionToken = req.cookies.get("pyq_session")?.value;
      const user = sessionToken ? getUserBySession(db, sessionToken) : null;
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const target = body.target === "Constable" ? "Constable" : "SI";
      updateUserTarget(db, user.id, target);

      return NextResponse.json({
        success: true,
        user: { ...user, target },
      });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Authentication error.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

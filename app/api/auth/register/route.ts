import { NextResponse } from "next/server";
import { registerUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { username, password } = (await request.json()) as {
      username?: string;
      password?: string;
    };

    if (!username || !password || username.trim().length < 3 || password.length < 8) {
      return NextResponse.json(
        { error: "Username must be at least 3 chars and password at least 8 chars." },
        { status: 400 },
      );
    }

    const user = await registerUser(username, password);
    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof Error && /unique/i.test(error.message)) {
      return NextResponse.json({ error: "Username already exists." }, { status: 409 });
    }

    return NextResponse.json({ error: "Failed to register user." }, { status: 500 });
  }
}

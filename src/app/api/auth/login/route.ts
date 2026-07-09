import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie } from "@/server/auth";
import { loginUser } from "@/server/backend";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? "");
  const password = String(body.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const result = await loginUser(email, password);
  if (!result.ok || !result.user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  await setSessionCookie({ userId: result.user.id, email: result.user.email });
  return NextResponse.json({ user: result.user });
}

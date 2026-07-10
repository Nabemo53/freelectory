import { NextRequest, NextResponse } from "next/server";
import { clearEmailCodeCookie, setSessionCookie, verifyEmailCodeCookie } from "@/server/auth";
import { registerUser, verifyEmailLoginCode } from "@/server/backend";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  const code = String(body.code ?? "").trim();
  const cookieCodeIsValid = await verifyEmailCodeCookie(email, code);
  const result = cookieCodeIsValid
    ? { ...(await registerUser({ email, name: email.split("@")[0] || "Freelectory User" })), ok: true }
    : await verifyEmailLoginCode(email, code);

  if (!result.ok || !result.user) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
  }

  await clearEmailCodeCookie();
  await setSessionCookie({ userId: result.user.id, email: result.user.email });
  return NextResponse.json({ user: result.user, created: result.created });
}

import { NextRequest, NextResponse } from "next/server";
import { setEmailCodeCookie } from "@/server/auth";
import { createEmailLoginCode } from "@/server/backend";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  try {
    const result = await createEmailLoginCode(String(body.email ?? ""));
    const email = String(body.email ?? "").trim().toLowerCase();
    await setEmailCodeCookie({ email, code: result.code });
    return NextResponse.json({
      ok: true,
      sent: result.sent,
      provider: result.provider,
      devCode: result.devCode,
      message: result.sent ? "Code sent" : "Email provider is not configured; use devCode for MVP testing.",
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create login code" }, { status: 400 });
  }
}

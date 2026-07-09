import { NextRequest, NextResponse } from "next/server";
import { getTelegramPhoneVerification } from "@/server/mock-store";

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code") ?? "";
  const verification = getTelegramPhoneVerification(code);

  if (!verification) {
    return NextResponse.json({ error: "Verification not found" }, { status: 404 });
  }

  return NextResponse.json({ verification });
}

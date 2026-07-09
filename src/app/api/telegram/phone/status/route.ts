import { NextRequest, NextResponse } from "next/server";
import { getPhoneVerification } from "@/server/backend";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code") ?? "";
  const verification = await getPhoneVerification(code);

  if (!verification) {
    return NextResponse.json({ error: "Verification not found" }, { status: 404 });
  }

  return NextResponse.json({ verification });
}

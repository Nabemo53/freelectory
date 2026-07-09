import { NextRequest, NextResponse } from "next/server";
import { setSessionCookie } from "@/server/auth";
import { registerUser } from "@/server/backend";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const result = await registerUser(body);
  await setSessionCookie({ userId: result.user.id, email: result.user.email });

  return NextResponse.json(result, { status: result.created ? 201 : 200 });
}

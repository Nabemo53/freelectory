import { NextResponse } from "next/server";
import { getSession } from "@/server/auth";
import { getCurrentUser } from "@/server/backend";

export async function GET() {
  const session = await getSession();
  const user = await getCurrentUser(session?.userId);
  return NextResponse.json({ user, authenticated: Boolean(session) });
}

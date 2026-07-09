import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/server/auth";
import { getCurrentUser, listApplications, updateCurrentUser } from "@/server/backend";

export async function GET() {
  const session = await getSession();
  const profile = await getCurrentUser(session?.userId);
  return NextResponse.json({ profile });
}

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const session = await getSession();
  const profile = await updateCurrentUser(session?.userId, body);
  const applications = await listApplications(session?.userId);

  return NextResponse.json({ profile, applicationsCount: applications.length });
}

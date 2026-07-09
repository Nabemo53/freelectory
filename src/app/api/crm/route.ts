import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/server/auth";
import { listApplications, updateApplicationStatus } from "@/server/backend";
import type { ApplicationStatus } from "@/server/types";

export async function GET() {
  const session = await getSession();
  const items = await listApplications(session?.userId);

  return NextResponse.json({ items, count: items.length });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const statuses: ApplicationStatus[] = ["saved", "sent", "viewed", "replied", "invited", "rejected"];

  if (!statuses.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const application = await updateApplicationStatus(String(body.applicationId ?? ""), body.status);
  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  return NextResponse.json({ application });
}

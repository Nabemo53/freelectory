import { NextRequest, NextResponse } from "next/server";
import { demoUserId, store } from "@/server/mock-store";
import type { ApplicationStatus } from "@/server/types";

export function GET() {
  const items = store.applications
    .filter((application) => application.userId === demoUserId)
    .map((application) => ({
      ...application,
      job: store.jobs.find((job) => job.id === application.jobId),
    }));

  return NextResponse.json({ items, count: items.length });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const application = store.applications.find((candidate) => candidate.id === body.applicationId);

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const statuses: ApplicationStatus[] = ["saved", "sent", "viewed", "replied", "invited", "rejected"];
  if (statuses.includes(body.status)) {
    application.status = body.status;
  }
  application.updatedAt = new Date().toISOString();

  return NextResponse.json({ application });
}

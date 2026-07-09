import { NextRequest, NextResponse } from "next/server";
import { generateApplicationReply } from "@/server/ai";
import { demoUserId, getDemoUser, spendToken, store } from "@/server/mock-store";
import type { ApplicationStatus } from "@/server/types";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const jobId = String(body.jobId ?? "job_frontend_hh");
  const job = store.jobs.find((candidate) => candidate.id === jobId);

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  try {
    spendToken(demoUserId, "application_generation");
    const profile = getDemoUser();
    const message = await generateApplicationReply({ profile, job, tone: body.tone });
    const now = new Date().toISOString();
    const application = {
      id: `app_${Date.now()}`,
      userId: demoUserId,
      jobId,
      status: (body.status === "saved" ? "saved" : "sent") as ApplicationStatus,
      message,
      resumeId: String(body.resumeId ?? "resume_frontend"),
      createdAt: now,
      updatedAt: now,
    };

    store.applications.unshift(application);
    return NextResponse.json({ application, tokens: profile.tokens }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to generate application" }, { status: 400 });
  }
}

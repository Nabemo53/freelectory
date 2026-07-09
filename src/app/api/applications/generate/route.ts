import { NextRequest, NextResponse } from "next/server";
import { generateApplicationReply } from "@/server/ai";
import { getSession } from "@/server/auth";
import { createApplication, getCurrentUser, getJob, spendUserToken } from "@/server/backend";
import type { ApplicationStatus } from "@/server/types";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const jobId = String(body.jobId ?? "job_frontend_hh");
  const session = await getSession();
  const job = await getJob(jobId);

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  try {
    const tokenResult = await spendUserToken(session?.userId, "application_generation");
    const profile = (await getCurrentUser(session?.userId)) ?? tokenResult.user;
    const message = await generateApplicationReply({ profile, job, tone: body.tone });
    const application = await createApplication(
      session?.userId,
      jobId,
      message,
      (body.status === "saved" ? "saved" : "sent") as ApplicationStatus,
      String(body.resumeId ?? "resume_frontend")
    );

    return NextResponse.json({ application, tokens: tokenResult.user.tokens }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to generate application" }, { status: 400 });
  }
}

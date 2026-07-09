import { NextRequest, NextResponse } from "next/server";
import { demoUserId, spendToken, store } from "@/server/mock-store";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const jobId = String(body.jobId ?? "");
  const liked = body.liked !== false;
  const job = store.jobs.find((candidate) => candidate.id === jobId);

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  try {
    const tokenResult = liked ? spendToken(demoUserId, "job_like") : null;
    const like = { userId: demoUserId, jobId, liked, createdAt: new Date().toISOString() };
    store.likes.unshift(like);

    return NextResponse.json({
      like,
      job,
      tokens: tokenResult?.user.tokens,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to like job" }, { status: 400 });
  }
}

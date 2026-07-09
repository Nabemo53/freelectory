import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/server/auth";
import { likeJob } from "@/server/backend";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const jobId = String(body.jobId ?? "");
  const liked = body.liked !== false;
  const session = await getSession();

  try {
    return NextResponse.json(await likeJob(session?.userId, jobId, liked));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to like job";
    return NextResponse.json({ error: message }, { status: message === "Job not found" ? 404 : 400 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { listJobs } from "@/server/backend";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobs = await listJobs({
    mode: searchParams.get("mode"),
    market: searchParams.get("market"),
    language: searchParams.get("language"),
  });

  return NextResponse.json({ jobs, count: jobs.length });
}

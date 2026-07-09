import { NextRequest, NextResponse } from "next/server";
import { getDemoUser, store } from "@/server/mock-store";

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode");
  const market = searchParams.get("market");
  const language = searchParams.get("language");
  const user = getDemoUser();

  const jobs = store.jobs
    .filter((job) => (mode === "clients" ? job.type === "project" : mode === "job" ? job.type === "vacancy" : true))
    .filter((job) => (market ? job.market === market : job.market === user.market || job.market === "global"))
    .filter((job) => (language && language !== "auto" ? job.language === language : true))
    .sort((a, b) => b.matchScore - a.matchScore);

  return NextResponse.json({ jobs, count: jobs.length });
}

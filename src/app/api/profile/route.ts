import { NextRequest, NextResponse } from "next/server";
import { demoUserId, getDemoUser, store } from "@/server/mock-store";

export function GET() {
  return NextResponse.json({ profile: getDemoUser() });
}

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const user = getDemoUser();

  user.name = body.name ? String(body.name) : user.name;
  user.title = body.title ? String(body.title) : user.title;
  user.location = body.location ? String(body.location) : user.location;
  user.mode = body.mode === "clients" ? "clients" : body.mode === "job" ? "job" : user.mode;
  user.market = body.market === "global" ? "global" : body.market === "cis" ? "cis" : user.market;
  user.language = body.language === "en" || body.language === "auto" ? body.language : body.language === "ru" ? "ru" : user.language;
  user.responseLanguage =
    body.responseLanguage === "en" || body.responseLanguage === "auto"
      ? body.responseLanguage
      : body.responseLanguage === "ru"
        ? "ru"
        : user.responseLanguage;
  user.skills = Array.isArray(body.skills) ? body.skills.map(String) : user.skills;
  user.experienceYears = body.experienceYears ? Number(body.experienceYears) : user.experienceYears;
  user.education = body.education ? String(body.education) : user.education;

  const applications = store.applications.filter((application) => application.userId === demoUserId);
  return NextResponse.json({ profile: user, applicationsCount: applications.length });
}

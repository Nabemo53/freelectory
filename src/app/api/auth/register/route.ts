import { NextRequest, NextResponse } from "next/server";
import { store } from "@/server/mock-store";
import type { UserProfile } from "@/server/types";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? `user${store.users.length + 1}@example.com`);
  const existing = store.users.find((user) => user.email === email);

  if (existing) {
    return NextResponse.json({ user: existing, created: false });
  }

  const user: UserProfile = {
    id: `user_${Date.now()}`,
    email,
    telegramId: body.telegramId ? String(body.telegramId) : undefined,
    name: String(body.name ?? "New Freelectory User"),
    title: String(body.title ?? "Frontend Developer"),
    location: String(body.location ?? "Москва, Россия"),
    mode: body.mode === "clients" ? "clients" : "job",
    market: body.market === "global" ? "global" : "cis",
    language: body.language === "en" ? "en" : "ru",
    responseLanguage: body.responseLanguage === "en" ? "en" : "ru",
    skills: Array.isArray(body.skills) ? body.skills.map(String) : ["React", "TypeScript", "Next.js"],
    experienceYears: Number(body.experienceYears ?? 3),
    education: String(body.education ?? "IT / Программная инженерия"),
    tokens: 20,
    maxTokens: 20,
    lastRefillAt: new Date().toISOString(),
    referralCode: String(body.referralCode ?? email.split("@")[0]),
  };

  store.users.push(user);
  store.transactions.unshift({
    id: `tx_${Date.now()}`,
    userId: user.id,
    amount: 20,
    reason: "registration_bonus",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ user, created: true }, { status: 201 });
}

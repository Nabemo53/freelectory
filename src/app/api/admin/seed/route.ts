import { NextResponse } from "next/server";
import { seedDatabase } from "@/server/backend";

export async function POST() {
  const result = await seedDatabase();
  return NextResponse.json({ ok: true, result });
}

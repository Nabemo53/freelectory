import { NextRequest, NextResponse } from "next/server";
import { telegramApi } from "@/server/telegram";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const url = String(body.url ?? "");

  if (!url.startsWith("https://")) {
    return NextResponse.json({ error: "Webhook URL must be https" }, { status: 400 });
  }

  const result = await telegramApi("setWebhook", {
    url,
    allowed_updates: ["message"],
  });

  return NextResponse.json({ ok: true, result });
}

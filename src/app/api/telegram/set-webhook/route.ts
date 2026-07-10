import { NextRequest, NextResponse } from "next/server";
import { telegramApi } from "@/server/telegram";

async function setWebhook(url: string) {
  return telegramApi("setWebhook", {
    url,
    allowed_updates: ["message"],
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://freelectory.vercel.app";
  const url = String(body.url ?? `${appUrl}/api/telegram/webhook`);

  if (!url.startsWith("https://")) {
    return NextResponse.json({ error: "Webhook URL must be https" }, { status: 400 });
  }

  const result = await setWebhook(url);
  return NextResponse.json({ ok: true, url, result });
}

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://freelectory.vercel.app";
  const url = `${appUrl}/api/telegram/webhook`;
  const result = await setWebhook(url);
  return NextResponse.json({ ok: true, url, result });
}

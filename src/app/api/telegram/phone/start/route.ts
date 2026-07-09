import { NextRequest, NextResponse } from "next/server";
import { createTelegramPhoneVerification, demoUserId } from "@/server/mock-store";
import { telegramApi } from "@/server/telegram";

async function getBotUsername() {
  if (process.env.TELEGRAM_BOT_USERNAME) {
    return process.env.TELEGRAM_BOT_USERNAME;
  }

  try {
    const response = await telegramApi<{ ok: boolean; result?: { username?: string } }>("getMe", {});
    return response.result?.username || "FreelectoryBot";
  } catch {
    return "FreelectoryBot";
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const phone = String(body.phone ?? "").trim();

  if (!phone) {
    return NextResponse.json({ error: "Phone is required" }, { status: 400 });
  }

  const verification = createTelegramPhoneVerification(demoUserId, phone);
  const botUsername = await getBotUsername();
  const botUrl = `https://t.me/${botUsername}?start=${verification.code}`;

  return NextResponse.json({
    verification,
    botUrl,
    instructions: "Open the Telegram bot and share your phone number via Telegram contact button.",
  });
}

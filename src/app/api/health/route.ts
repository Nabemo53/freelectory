import { NextResponse } from "next/server";
import { hasTelegramToken } from "@/server/telegram";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "freelectory-api",
    version: "0.1.0",
    telegramConfigured: hasTelegramToken(),
    timestamp: new Date().toISOString(),
  });
}

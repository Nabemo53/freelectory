import { NextResponse } from "next/server";
import { hasDatabase } from "@/server/prisma";
import { hasTelegramToken } from "@/server/telegram";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "freelectory-api",
    version: "0.1.0",
    telegramConfigured: hasTelegramToken(),
    databaseConfigured: hasDatabase,
    authConfigured: Boolean(process.env.AUTH_SECRET),
    timestamp: new Date().toISOString(),
  });
}

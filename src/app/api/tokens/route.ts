import { NextRequest, NextResponse } from "next/server";
import { demoUserId, getDemoUser, rewardTokens, store } from "@/server/mock-store";

export function GET() {
  const user = getDemoUser();
  const transactions = store.transactions.filter((transaction) => transaction.userId === demoUserId);

  return NextResponse.json({
    balance: user.tokens,
    maxBalance: user.maxTokens,
    refill: "+5 каждые 5 часов",
    transactions,
    costs: {
      like: 1,
      applicationGeneration: 1,
      coverLetter: 1,
      resumeImprovement: 2,
      jobAnalysis: 1,
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const amount = Number(body.amount ?? 5);
  const result = rewardTokens(demoUserId, String(body.reason ?? "manual_refill"), amount);
  return NextResponse.json({ balance: result.user.tokens, transaction: result.transaction });
}

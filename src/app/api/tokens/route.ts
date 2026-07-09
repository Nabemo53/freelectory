import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/server/auth";
import { listTokenTransactions, rewardUserTokens } from "@/server/backend";

export async function GET() {
  const session = await getSession();
  const { user, transactions } = await listTokenTransactions(session?.userId);

  return NextResponse.json({
    balance: user?.tokens ?? 0,
    maxBalance: user?.maxTokens ?? 20,
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
  const session = await getSession();
  const amount = Number(body.amount ?? 5);
  const result = await rewardUserTokens(session?.userId, String(body.reason ?? "manual_refill"), amount);

  return NextResponse.json({ balance: result.user.tokens, transaction: result.transaction });
}

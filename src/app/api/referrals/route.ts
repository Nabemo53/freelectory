import { NextRequest, NextResponse } from "next/server";
import { demoUserId, getDemoUser, rewardTokens, store } from "@/server/mock-store";

export function GET() {
  const user = getDemoUser();
  const referrals = store.referrals.filter((referral) => referral.userId === demoUserId);
  return NextResponse.json({
    code: user.referralCode,
    url: `jobai.app/ref/${user.referralCode}`,
    inviterReward: 10,
    friendReward: 5,
    referrals,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const referredUserId = String(body.referredUserId ?? `user_ref_${Date.now()}`);
  const referral = {
    id: `ref_${Date.now()}`,
    userId: demoUserId,
    referredUserId,
    rewardTokens: 10,
    createdAt: new Date().toISOString(),
  };

  store.referrals.unshift(referral);
  const reward = rewardTokens(demoUserId, "referral_reward", 10);
  return NextResponse.json({ referral, balance: reward.user.tokens }, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/server/auth";
import { createReferral, listReferrals } from "@/server/backend";

export async function GET() {
  const session = await getSession();
  const { user, referrals } = await listReferrals(session?.userId);
  const code = user?.referralCode ?? "demo";

  return NextResponse.json({
    code,
    url: `freelectory.app/ref/${code}`,
    inviterReward: 10,
    friendReward: 5,
    referrals,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const session = await getSession();
  const referredUserId = String(body.referredUserId ?? `user_ref_${Date.now()}`);
  const result = await createReferral(session?.userId, referredUserId);

  return NextResponse.json(result, { status: 201 });
}

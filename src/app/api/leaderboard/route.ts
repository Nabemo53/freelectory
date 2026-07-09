import { NextResponse } from "next/server";
import { leaderboard } from "@/lib/mock-data";

export function GET() {
  return NextResponse.json({
    users: leaderboard.map((user, index) => ({
      rank: index + 1,
      ...user,
      activity: 260 - index * 29,
      sent: 152 - index * 17,
      replies: 18 - index * 2,
    })),
  });
}

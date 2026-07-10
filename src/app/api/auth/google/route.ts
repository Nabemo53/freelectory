import { NextResponse } from "next/server";
import { setSessionCookie } from "@/server/auth";
import { registerUser } from "@/server/backend";

export async function POST() {
  const result = await registerUser({
    email: "google-user@freelectory.local",
    name: "Google User",
    title: "Freelectory member",
  });

  await setSessionCookie({ userId: result.user.id, email: result.user.email });

  return NextResponse.json({
    ok: true,
    user: result.user,
    created: result.created,
    mode: "mvp-google",
    note: "MVP Google sign-in. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET for real OAuth.",
  });
}

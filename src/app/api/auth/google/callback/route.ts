import { NextRequest, NextResponse } from "next/server";
import { createSessionToken } from "@/server/auth";
import { registerUser } from "@/server/backend";

const stateCookie = "freelectory_google_state";

type TokenResponse = {
  access_token?: string;
  id_token?: string;
  error?: string;
};

type GoogleUser = {
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
};

function getBaseUrl(request: NextRequest) {
  return process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const savedState = request.cookies.get(stateCookie)?.value;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret || !code || !state || state !== savedState) {
    return NextResponse.redirect(new URL("/auth?google=failed", request.url));
  }

  const baseUrl = getBaseUrl(request);
  const redirectUri = `${baseUrl}/api/auth/google/callback`;
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  const tokenData = (await tokenResponse.json()) as TokenResponse;
  if (!tokenResponse.ok || !tokenData.access_token) {
    return NextResponse.redirect(new URL("/auth?google=failed", request.url));
  }

  const userResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { authorization: `Bearer ${tokenData.access_token}` },
  });
  const googleUser = (await userResponse.json()) as GoogleUser;
  if (!userResponse.ok || !googleUser.email) {
    return NextResponse.redirect(new URL("/auth?google=failed", request.url));
  }

  const result = await registerUser({
    email: googleUser.email,
    name: googleUser.name || googleUser.email.split("@")[0],
    telegramId: `google:${googleUser.sub}`,
    title: "Freelectory member",
  });

  const response = NextResponse.redirect(new URL("/onboarding", request.url));
  response.cookies.delete(stateCookie);
  const sessionToken = await createSessionToken({ userId: result.user.id, email: result.user.email });
  response.cookies.set("freelectory_session", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

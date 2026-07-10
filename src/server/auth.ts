import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const cookieName = "freelectory_session";
const emailCodeCookieName = "freelectory_email_code";
const encoder = new TextEncoder();

function getSecret() {
  return encoder.encode(process.env.AUTH_SECRET || "freelectory-local-dev-secret-change-me");
}

export type SessionPayload = {
  userId: string;
  email: string;
};

type EmailCodePayload = {
  email: string;
  code: string;
};

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());
}

export async function setSessionCookie(payload: SessionPayload) {
  const token = await createSessionToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function setEmailCodeCookie(payload: EmailCodePayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(getSecret());
  const cookieStore = await cookies();
  cookieStore.set(emailCodeCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });
}

export async function verifyEmailCodeCookie(email: string, code: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(emailCodeCookieName)?.value;
  if (!token) return false;

  try {
    const verified = await jwtVerify(token, getSecret());
    const payload = verified.payload as Partial<EmailCodePayload>;
    return payload.email === email && payload.code === code;
  } catch {
    return false;
  }
}

export async function clearEmailCodeCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(emailCodeCookieName);
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;

  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(token, getSecret());
    const payload = verified.payload as Partial<SessionPayload>;
    if (!payload.userId || !payload.email) {
      return null;
    }
    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}

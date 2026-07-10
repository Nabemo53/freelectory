"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Mail, ShieldCheck, UserRound, Zap } from "lucide-react";
import { FormEvent, useState } from "react";
import { PublicControls } from "@/components/layout/public-controls";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const copy = {
  ru: {
    title: "Войти в Freelectory",
    subtitle: "Главный вход через Google. После входа Freelectory спросит цель, даст рассказать голосом или текстом и соберёт подбор.",
    benefits: ["Google как основной вход", "Email-код оставлен как запасной вариант", "Телефон подтверждается позже через Telegram-бота"],
    cardTitle: "Вход",
    cardDesc: "Нажмите Google и переходите к настройке подбора.",
    google: "Продолжить с Google",
    googleLoading: "Входим...",
    emailFallback: "Запасной вход по email-коду",
    email: "Email",
    code: "Код",
    sendCode: "Получить код",
    verify: "Войти по коду",
    devCode: "Тестовый код:",
    ready: "Готово. Можно продолжать.",
    continue: "Продолжить",
    privacy: "Номер телефона не нужен при входе. В настройках есть отдельное подтверждение через Telegram.",
  },
  en: {
    title: "Sign in to Freelectory",
    subtitle: "Google is the main sign-in. Then Freelectory asks your goal, lets you speak or type, and prepares matching.",
    benefits: ["Google as primary sign-in", "Email code kept as fallback", "Phone is verified later through Telegram bot"],
    cardTitle: "Sign in",
    cardDesc: "Press Google and continue to matching setup.",
    google: "Continue with Google",
    googleLoading: "Signing in...",
    emailFallback: "Fallback email-code sign-in",
    email: "Email",
    code: "Code",
    sendCode: "Get code",
    verify: "Sign in with code",
    devCode: "Test code:",
    ready: "Done. You can continue.",
    continue: "Continue",
    privacy: "Phone is not needed for sign-in. Settings has a separate Telegram verification flow.",
  },
};

type CodeResponse = { ok: boolean; sent: boolean; devCode?: string; error?: string; message?: string };

export default function AuthPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = copy[language];
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const signInGoogle = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/google", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Google sign-in failed");
      router.push("/onboarding");
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : "Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const requestCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("");
    setDevCode("");
    setIsSending(true);
    try {
      const response = await fetch("/api/auth/email/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as CodeResponse;
      if (!response.ok) throw new Error(data.error ?? data.message ?? "Unable to send code");
      if (data.devCode) setDevCode(data.devCode);
      setStatus(data.sent ? t.ready : `${t.devCode} ${data.devCode ?? ""}`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to send code");
    } finally {
      setIsSending(false);
    }
  };

  const verifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsChecking(true);
    try {
      const response = await fetch("/api/auth/email/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Invalid code");
      router.push("/onboarding");
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : "Invalid code");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-background text-foreground lg:grid-cols-[0.95fr_1.05fr]">
      <section className="flex flex-col justify-between border-r bg-muted/35 px-6 py-6 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Zap className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold">Freelectory</span>
          </Link>
          <PublicControls />
        </div>

        <div className="my-12 max-w-xl">
          <h1 className="text-4xl font-semibold tracking-normal md:text-5xl">{t.title}</h1>
          <p className="mt-5 text-base leading-7 text-muted-foreground">{t.subtitle}</p>
          <div className="mt-8 grid gap-3">
            {t.benefits.map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4 text-success" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs leading-5 text-muted-foreground">MVP: Google-first auth, email fallback, Telegram phone verification in settings.</p>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">{t.cardTitle}</CardTitle>
            <CardDescription>{t.cardDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="h-11 w-full" size="lg" type="button" onClick={signInGoogle} disabled={googleLoading}>
              <UserRound className="h-4 w-4" />
              {googleLoading ? t.googleLoading : t.google}
            </Button>

            <details className="rounded-lg border bg-muted/30 p-3">
              <summary className="cursor-pointer text-sm font-semibold">{t.emailFallback}</summary>
              <div className="mt-4 space-y-3">
                <form className="space-y-3" onSubmit={requestCode}>
                  <Input placeholder={t.email} type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                  <Button className="w-full" variant="secondary" type="submit" disabled={isSending || !email}>
                    <Mail className="h-4 w-4" />
                    {isSending ? "..." : t.sendCode}
                  </Button>
                </form>
                <form className="space-y-3" onSubmit={verifyCode}>
                  <Input inputMode="numeric" maxLength={6} placeholder={t.code} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} />
                  <Button className="w-full" type="submit" disabled={isChecking || code.length !== 6 || !email}>
                    {isChecking ? "..." : t.verify}
                  </Button>
                </form>
                {devCode && (
                  <button type="button" onClick={() => setCode(devCode)} className="w-full rounded-md border bg-background px-3 py-2 text-left text-sm">
                    {t.devCode} <span className="font-mono font-semibold text-primary">{devCode}</span>
                  </button>
                )}
              </div>
            </details>

            {status && <p className="rounded-md border border-success/30 bg-success/10 px-3 py-2 text-xs text-success">{status}</p>}
            {error && <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>}

            <Button className="w-full" variant="outline" type="button" onClick={() => router.push("/onboarding")}>
              {t.continue} <ArrowRight className="h-4 w-4" />
            </Button>
            <div className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              {t.privacy}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

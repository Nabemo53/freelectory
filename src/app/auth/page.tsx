"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, KeyRound, Mail, ShieldCheck, Zap } from "lucide-react";
import { FormEvent, useState } from "react";
import { PublicControls } from "@/components/layout/public-controls";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const copy = {
  ru: {
    title: "Вход в Freelectory",
    subtitle: "Сначала вход или регистрация. Потом Freelectory спросит вашу цель и подберёт направление, рынок, платформы и резюме.",
    benefits: ["20 токенов после первого входа", "Без обязательного телефона", "Telegram подключается позже как бонус"],
    cardTitle: "Войти или создать аккаунт",
    cardDesc: "Введите email. Мы отправим одноразовый код для входа без пароля.",
    email: "Email",
    code: "Код из письма",
    sendCode: "Получить код",
    verify: "Войти по коду",
    sending: "Отправляем...",
    checking: "Проверяем...",
    google: "Войти через Google",
    googleNote: "Google подключим после создания OAuth Client ID и Secret. Сейчас работает бесплатный вход по email-коду.",
    devCode: "Почтовый сервис пока не подключён. Для теста используйте код:",
    sent: "Код отправлен. Проверьте почту и введите 6 цифр.",
    ready: "Готово. Аккаунт создан или найден.",
    continue: "Продолжить к подбору",
    privacy: "Номер телефона не нужен для регистрации. Telegram-бот подключается позже в профиле или настройках.",
  },
  en: {
    title: "Sign in to Freelectory",
    subtitle: "Sign in first. Then Freelectory asks about your goal and suggests direction, market, platforms, and resume flow.",
    benefits: ["20 tokens after first sign-in", "No required phone confirmation", "Telegram connects later as a bonus"],
    cardTitle: "Sign in or create account",
    cardDesc: "Enter your email. We will send a one-time login code without a password.",
    email: "Email",
    code: "Email code",
    sendCode: "Get code",
    verify: "Sign in with code",
    sending: "Sending...",
    checking: "Checking...",
    google: "Sign in with Google",
    googleNote: "Google will be enabled after OAuth Client ID and Secret are created. Free email-code login works now.",
    devCode: "Email provider is not connected yet. For MVP testing use this code:",
    sent: "Code sent. Check your email and enter 6 digits.",
    ready: "Done. Account is created or found.",
    continue: "Continue to matching",
    privacy: "Phone is not required for registration. Telegram bot connects later in profile or settings.",
  },
};

type CodeResponse = {
  ok: boolean;
  sent: boolean;
  devCode?: string;
  message?: string;
  error?: string;
};

export default function AuthPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = copy[language];
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

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

      setStatus(data.sent ? t.sent : t.devCode);
      if (data.devCode) setDevCode(data.devCode);
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

      setIsVerified(true);
      setStatus(t.ready);
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

        <p className="text-xs leading-5 text-muted-foreground">MVP: email-code auth, cookie session, Telegram later.</p>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">{t.cardTitle}</CardTitle>
            <CardDescription>{t.cardDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-3" onSubmit={requestCode}>
              <Input placeholder={t.email} type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              <Button className="w-full" type="submit" disabled={isSending || !email}>
                <Mail className="h-4 w-4" />
                {isSending ? t.sending : t.sendCode}
              </Button>
            </form>

            <form className="space-y-3" onSubmit={verifyCode}>
              <Input
                inputMode="numeric"
                maxLength={6}
                placeholder={t.code}
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                required
              />
              <Button className="w-full" type="submit" disabled={isChecking || code.length !== 6 || !email}>
                <KeyRound className="h-4 w-4" />
                {isChecking ? t.checking : t.verify}
              </Button>
            </form>

            {devCode && (
              <button
                type="button"
                onClick={() => setCode(devCode)}
                className="w-full rounded-md border bg-muted/35 px-3 py-3 text-left text-sm font-semibold"
              >
                {t.devCode} <span className="font-mono text-primary">{devCode}</span>
              </button>
            )}

            <div className="rounded-lg border bg-muted/35 p-3">
              <Button className="w-full justify-start" variant="outline" disabled>
                <Mail className="h-4 w-4" />
                {t.google}
              </Button>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">{t.googleNote}</p>
            </div>

            {status && <p className="rounded-md border border-success/30 bg-success/10 px-3 py-2 text-xs text-success">{status}</p>}
            {error && <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>}

            <Button className="w-full" size="lg" type="button" disabled={!isVerified} onClick={() => router.push("/onboarding")}>
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

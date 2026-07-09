"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Bot, CheckCircle2, Mail, Phone, ShieldCheck, Zap } from "lucide-react";
import { FormEvent, useState } from "react";
import { PublicControls } from "@/components/layout/public-controls";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const copy = {
  ru: {
    title: "Войдите и получите персональный подбор",
    subtitle:
      "После входа Freelectory не заставит выбирать сложные категории. Вы просто объясните AI, что умеете или кого ищете.",
    benefits: ["20 токенов за регистрацию", "+5 токенов за Telegram", "+5 токенов за подтверждение телефона"],
    cardTitle: "Регистрация или вход",
    cardDesc: "Дальше начнётся разговор с AI о вашей задаче.",
    register: "Регистрация",
    login: "Вход",
    name: "Имя",
    email: "Email",
    password: "Пароль",
    submitRegister: "Создать аккаунт",
    submitLogin: "Войти",
    google: "Google позже",
    telegram: "Telegram позже",
    or: "или",
    phoneTitle: "Подтверждение телефона",
    phoneText: "Подтверждение идёт через Telegram-бота: бот попросит поделиться контактом. SMS и звонок не нужны.",
    phoneAction: "Подтвердить через Telegram-бота",
    botLink: "Открыть бота",
    botReady: "Ссылка готова. Откройте бота и нажмите кнопку «Поделиться номером телефона».",
    continue: "Продолжить к AI",
    privacy: "Данные используются только для подбора, резюме и откликов.",
    authOk: "Готово. Аккаунт создан, можно продолжать.",
  },
  en: {
    title: "Sign in and get a personal match",
    subtitle:
      "After login Freelectory will not force you to choose complex categories. You simply explain to AI what you can do or who you are looking for.",
    benefits: ["20 tokens for registration", "+5 tokens for Telegram", "+5 tokens for phone confirmation"],
    cardTitle: "Sign up or log in",
    cardDesc: "Next you will have a simple AI conversation about your task.",
    register: "Sign up",
    login: "Log in",
    name: "Name",
    email: "Email",
    password: "Password",
    submitRegister: "Create account",
    submitLogin: "Log in",
    google: "Google later",
    telegram: "Telegram later",
    or: "or",
    phoneTitle: "Phone confirmation",
    phoneText: "Confirmation happens through the Telegram bot: the bot asks you to share your contact. No SMS or call is needed.",
    phoneAction: "Confirm via Telegram bot",
    botLink: "Open bot",
    botReady: "Link is ready. Open the bot and tap Share phone number.",
    continue: "Continue to AI",
    privacy: "Data is used only for matching, resume, and replies.",
    authOk: "Done. Account is ready, you can continue.",
  },
};

export default function AuthPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = copy[language];
  const [mode, setMode] = useState<"register" | "login">("register");
  const [name, setName] = useState("Freelectory User");
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("password123");
  const [phone, setPhone] = useState("+7 (999) 123-45-67");
  const [botUrl, setBotUrl] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStartingVerification, setIsStartingVerification] = useState(false);

  const submitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("");
    setIsSubmitting(true);

    try {
      const response = await fetch(mode === "register" ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Auth failed");
      }
      setStatus(t.authOk);
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Auth failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startTelegramPhoneVerification = async () => {
    setIsStartingVerification(true);
    setError("");
    try {
      const response = await fetch("/api/telegram/phone/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Telegram verification failed");
      }
      setBotUrl(data.botUrl);
      setVerificationCode(data.verification.code);
    } catch (verificationError) {
      setError(verificationError instanceof Error ? verificationError.message : "Telegram verification failed");
    } finally {
      setIsStartingVerification(false);
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

        <p className="text-xs leading-5 text-muted-foreground">MVP backend: cookie session, Telegram phone flow, Prisma-ready API.</p>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">{t.cardTitle}</CardTitle>
            <CardDescription>{t.cardDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 rounded-lg border bg-muted/35 p-1">
              <Button type="button" variant={mode === "register" ? "default" : "ghost"} onClick={() => setMode("register")}>
                {t.register}
              </Button>
              <Button type="button" variant={mode === "login" ? "default" : "ghost"} onClick={() => setMode("login")}>
                {t.login}
              </Button>
            </div>

            <form className="space-y-3" onSubmit={submitAuth}>
              {mode === "register" && <Input placeholder={t.name} value={name} onChange={(event) => setName(event.target.value)} />}
              <Input placeholder={t.email} type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              <Input placeholder={t.password} type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                <Mail className="h-4 w-4" />
                {isSubmitting ? "..." : mode === "register" ? t.submitRegister : t.submitLogin}
              </Button>
            </form>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px bg-border" />
              {t.or}
              <div className="h-px bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button className="justify-start" variant="outline" disabled>
                <Mail className="h-4 w-4" />
                {t.google}
              </Button>
              <Button className="justify-start" variant="outline" disabled>
                <Bot className="h-4 w-4" />
                {t.telegram}
              </Button>
            </div>

            <div className="rounded-lg border bg-muted/35 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Phone className="h-4 w-4" />
                {t.phoneTitle}
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{t.phoneText}</p>
              <Input className="mt-3" placeholder="+7 (999) 123-45-67" value={phone} onChange={(event) => setPhone(event.target.value)} />
              <Button className="mt-3 w-full" variant="secondary" type="button" onClick={startTelegramPhoneVerification} disabled={isStartingVerification}>
                <Bot className="h-4 w-4" />
                {isStartingVerification ? "..." : t.phoneAction}
              </Button>
              {botUrl && (
                <div className="mt-3 rounded-md border bg-background p-3">
                  <p className="text-xs leading-5 text-muted-foreground">{t.botReady}</p>
                  <a className="mt-2 inline-flex h-8 items-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground" href={botUrl} target="_blank" rel="noreferrer">
                    {t.botLink}
                  </a>
                  <p className="mt-2 text-[11px] text-muted-foreground">code: {verificationCode}</p>
                </div>
              )}
            </div>

            {status && <p className="rounded-md border border-success/30 bg-success/10 px-3 py-2 text-xs text-success">{status}</p>}
            {error && <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>}

            <Button className="w-full" size="lg" type="button" onClick={() => router.push("/onboarding")}>
              {t.continue} <ArrowRight className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              {t.privacy}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

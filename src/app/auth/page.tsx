"use client";

import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, Mail, Phone, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";
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
    benefits: ["20 токенов за регистрацию", "+5 токенов за привязку Telegram", "+5 токенов за подтверждение телефона"],
    cardTitle: "Регистрация или вход",
    cardDesc: "Дальше начнётся разговор с AI о вашей задаче.",
    google: "Продолжить через Google",
    telegram: "Привязать Telegram и получить +5 токенов",
    or: "или",
    phoneTitle: "Подтверждение телефона",
    phoneText: "Подтверждение идёт через Telegram-бота: бот попросит поделиться контактом. SMS и звонок не нужны.",
    phoneAction: "Подтвердить через Telegram-бота",
    botLink: "Открыть бота",
    botReady: "Ссылка готова. Откройте бота и нажмите кнопку «Поделиться номером телефона».",
    continue: "Продолжить",
    privacy: "Данные используются только для подбора, резюме и откликов.",
  },
  en: {
    title: "Sign in and get a personal match",
    subtitle:
      "After login Freelectory will not force you to choose complex categories. You simply explain to AI what you can do or who you are looking for.",
    benefits: ["20 tokens for registration", "+5 tokens for connecting Telegram", "+5 tokens for phone confirmation"],
    cardTitle: "Sign up or log in",
    cardDesc: "Next you will have a simple AI conversation about your task.",
    google: "Continue with Google",
    telegram: "Connect Telegram and get +5 tokens",
    or: "or",
    phoneTitle: "Phone confirmation",
    phoneText: "Confirmation happens through the Telegram bot: the bot asks you to share your contact. No SMS or call is needed.",
    phoneAction: "Confirm via Telegram bot",
    botLink: "Open bot",
    botReady: "Link is ready. Open the bot and tap Share phone number.",
    continue: "Continue",
    privacy: "Data is used only for matching, resume, and replies.",
  },
};

export default function AuthPage() {
  const { language } = useLanguage();
  const t = copy[language];
  const [phone, setPhone] = useState("+7 (999) 123-45-67");
  const [botUrl, setBotUrl] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isStartingVerification, setIsStartingVerification] = useState(false);

  const startTelegramPhoneVerification = async () => {
    setIsStartingVerification(true);
    try {
      const response = await fetch("/api/telegram/phone/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      if (response.ok) {
        setBotUrl(data.botUrl);
        setVerificationCode(data.verification.code);
      }
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

        <p className="text-xs leading-5 text-muted-foreground">MVP: auth is mocked, API contracts are ready.</p>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">{t.cardTitle}</CardTitle>
            <CardDescription>{t.cardDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <Mail className="h-4 w-4" />
              {t.google}
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Bot className="h-4 w-4" />
              {t.telegram}
            </Button>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px bg-border" />
              {t.or}
              <div className="h-px bg-border" />
            </div>
            <Input placeholder="Email" type="email" />
            <Input placeholder="+7 (999) 123-45-67" value={phone} onChange={(event) => setPhone(event.target.value)} />
            <div className="rounded-lg border bg-muted/35 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Phone className="h-4 w-4" />
                {t.phoneTitle}
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{t.phoneText}</p>
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
            <Button className="w-full" size="lg">
              <Link href="/onboarding" className="flex items-center gap-2">
                {t.continue} <ArrowRight className="h-4 w-4" />
              </Link>
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

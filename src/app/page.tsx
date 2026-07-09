"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Mic,
  Search,
  Sparkles,
  UsersRound,
  Zap,
} from "lucide-react";
import { PublicControls } from "@/components/layout/public-controls";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const copy = {
  ru: {
    navHow: "Как работает",
    navResume: "Резюме",
    navTelegram: "Telegram",
    login: "Войти",
    start: "Начать",
    kicker: "AI подберёт направление, платформу и первые возможности",
    title: "Расскажите, что вы умеете. Freelectory найдёт работу или клиентов.",
    subtitle:
      "Не нужно разбираться в биржах, категориях и вакансиях. Вы голосом или текстом объясняете, что умеете или кого хотите найти, а AI выбирает категорию, платформы, резюме и первые отклики.",
    primary: "Зарегистрироваться",
    secondary: "Как это работает",
    outcomes: [
      "AI сам определит вашу категорию и подходящие платформы",
      "Можно говорить голосом или написать обычными словами",
      "После входа Freelectory соберёт резюме, подбор и CRM",
    ],
    cardLabel: "Пример анализа AI",
    cardTitle: "Вы умеете делать сайты для недвижимости",
    cardText:
      "Freelectory предложит категории: landing pages, lead generation, CRM, real estate. Платформы: FL.ru, Upwork, Telegram-каналы, локальные доски заявок.",
    matches: "подходящих заявок",
    crm: "лидов в CRM",
    telegram: "Telegram и телефон дают бонусные токены",
    howTitle: "Путь пользователя",
    howText: "Для клиента это не onboarding, а понятный разговор с AI: вошёл, рассказал задачу, получил направление и подбор.",
    flow: [
      ["1. Вход", "Регистрация, Telegram и телефон для токенов и уведомлений."],
      ["2. Рассказать AI", "Голосом или текстом: что умею, кого ищу, какой результат нужен."],
      ["3. AI анализ", "AI выбирает категорию, платформы, резюме и стратегию поиска."],
      ["4. Подбор", "Показывает вакансии или заявки, генерирует отклик и ведёт CRM."],
    ],
    resumeTitle: "Резюме появляется тогда, когда оно действительно нужно",
    resumeText:
      "Если человек ищет работу, AI спросит: загрузить резюме, собрать новое или улучшить старое. Если человек ищет клиентов, AI соберёт профиль и коммерческое предложение.",
  },
  en: {
    navHow: "How it works",
    navResume: "Resume",
    navTelegram: "Telegram",
    login: "Log in",
    start: "Start",
    kicker: "AI chooses your niche, platforms, and first opportunities",
    title: "Tell us what you can do. Freelectory finds jobs or clients.",
    subtitle:
      "You do not need to understand marketplaces, categories, or job boards. Explain your skills or the people you want to find by voice or text, and AI chooses the niche, platforms, resume, and first replies.",
    primary: "Create account",
    secondary: "See how it works",
    outcomes: [
      "AI detects your category and matching platforms",
      "You can speak by voice or write naturally",
      "After login Freelectory builds resume, matches, and CRM",
    ],
    cardLabel: "AI analysis example",
    cardTitle: "You build websites for real estate",
    cardText:
      "Freelectory suggests categories: landing pages, lead generation, CRM, real estate. Platforms: Upwork, freelance boards, Telegram channels, local lead sources.",
    matches: "matching leads",
    crm: "leads in CRM",
    telegram: "Telegram and phone add bonus tokens",
    howTitle: "User path",
    howText: "For the customer this is not onboarding. It is a simple AI conversation: log in, explain the task, get direction and matches.",
    flow: [
      ["1. Sign in", "Registration, Telegram, and phone for tokens and alerts."],
      ["2. Tell AI", "By voice or text: what I can do, who I need, what result I want."],
      ["3. AI analysis", "AI chooses category, platforms, resume, and search strategy."],
      ["4. Matches", "Shows jobs or leads, generates replies, and tracks CRM."],
    ],
    resumeTitle: "Resume appears only when it is actually needed",
    resumeText:
      "If the user looks for a job, AI asks whether to upload, create, or improve a resume. If the user looks for clients, AI builds a profile and proposal.",
  },
};

export default function Home() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold">Freelectory</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#how">{t.navHow}</a>
          <a href="#resume">{t.navResume}</a>
          <a href="#telegram">{t.navTelegram}</a>
        </nav>
        <div className="flex items-center gap-2">
          <PublicControls />
          <Link className="hidden h-9 items-center rounded-md border px-3 text-sm font-medium hover:bg-muted sm:inline-flex" href="/auth">
            {t.login}
          </Link>
          <Link className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90" href="/auth">
            {t.start} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1fr_0.88fr] lg:px-6 lg:py-20">
        <div className="flex flex-col justify-center">
          <div className="mb-5 flex w-fit items-center gap-2 rounded-md border bg-muted px-3 py-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-primary" />
            {t.kicker}
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-normal md:text-6xl">{t.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{t.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg">
              <Link href="/auth" className="flex items-center gap-2">
                {t.primary} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              <a href="#how">{t.secondary}</a>
            </Button>
          </div>
          <div className="mt-8 grid gap-3">
            {t.outcomes.map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4 text-success" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle>{t.cardLabel}</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="rounded-xl border bg-[#111827] p-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">{t.cardLabel}</p>
                  <h2 className="mt-3 text-2xl font-semibold">{t.cardTitle}</h2>
                </div>
                <span className="rounded-md bg-emerald-400/15 px-2 py-1 text-xs font-semibold text-emerald-200">AI</span>
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-200">{t.cardText}</p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <Search className="h-5 w-5 text-primary" />
                <p className="mt-3 text-2xl font-semibold">128</p>
                <p className="text-sm text-muted-foreground">{t.matches}</p>
              </div>
              <div className="rounded-lg border p-4">
                <BriefcaseBusiness className="h-5 w-5 text-primary" />
                <p className="mt-3 text-2xl font-semibold">19</p>
                <p className="text-sm text-muted-foreground">{t.crm}</p>
              </div>
            </div>
            <div className="mt-4 rounded-lg border bg-muted/40 p-4" id="telegram">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Bot className="h-4 w-4" />
                {t.telegram}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="how" className="mx-auto max-w-7xl px-4 pb-16 lg:px-6">
        <div className="mb-6">
          <h2 className="text-3xl font-semibold tracking-normal">{t.howTitle}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{t.howText}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {t.flow.map(([title, text], index) => {
            const icons = [UsersRound, Mic, Sparkles, FileText];
            const Icon = icons[index];
            return (
              <Card key={title}>
                <CardContent className="p-5">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-4 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="resume" className="border-y bg-muted/35">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 lg:grid-cols-[0.85fr_1fr] lg:px-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-normal">{t.resumeTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{t.resumeText}</p>
            <Button className="mt-6">
              <Link href="/auth">{t.primary}</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

import { useMemo, useState } from "react";
import type { ComponentType } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BriefcaseBusiness,
  Check,
  FileText,
  Globe2,
  Mic,
  Paperclip,
  Search,
  Sparkles,
  Upload,
  UsersRound,
  Zap,
} from "lucide-react";
import { PublicControls } from "@/components/layout/public-controls";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Goal = "job" | "clients";
type ResumeMode = "generate" | "upload" | "proposal";

const dictionaries = {
  ru: {
    steps: ["Цель", "Рассказ AI", "Анализ", "Платформы", "Резюме/профиль", "Готово"],
    setup: "Персональный подбор",
    sideText: "AI задаёт пару простых вопросов и сам выбирает категорию, платформы и следующий шаг.",
    telegram: "Telegram бонус",
    telegramText: "Привяжите Telegram и телефон, чтобы получать карточки, напоминания и токены.",
    cardDescription: "Не выбирайте сложные категории вручную. Объясните задачу обычными словами.",
    back: "Назад",
    next: "Продолжить",
    done: "Готово",
    step0Title: "Что вы хотите получить?",
    jobTitle: "Ищу работу",
    jobText: "AI поможет понять, какая роль подходит, где искать вакансии и какое резюме нужно.",
    clientsTitle: "Ищу клиентов",
    clientsText: "AI поймёт, какие услуги вы продаёте, кому их предлагать и где искать заявки.",
    step1Title: "Расскажите AI, что вы умеете или кого ищете",
    step1Text:
      "Можно написать как человеку. Например: “делаю сайты для недвижимости”, “ищу клиентов на ремонт”, “хочу работу без опыта”, “нужны дизайнеры на проект”.",
    voice: "Сказать голосом",
    typedLabel: "Текст для AI",
    typedPlaceholder: "Напишите обычными словами: что умеете, кого хотите найти, какой результат нужен...",
    sampleJob: "Я умею общаться с клиентами, немного знаю Excel, хочу удалённую работу без опыта и не понимаю, какие вакансии мне подходят.",
    sampleClients: "Я делаю сайты и рекламу для недвижимости. Хочу найти клиентов-застройщиков или риелторов, но не знаю, где искать заявки.",
    step2Title: "AI анализирует и предлагает направление",
    category: "Категория",
    categoryJob: "Администратор / поддержка / junior sales",
    categoryClients: "Недвижимость: сайты, лидогенерация, CRM",
    why: "Почему",
    whyJob: "По описанию подходят роли с коммуникацией, базовыми таблицами и быстрым обучением.",
    whyClients: "Вы продаёте понятный результат бизнесу: заявки и сайт для объектов недвижимости.",
    edit: "Можно уточнить ответ AI позже",
    step3Title: "AI выбирает платформы",
    platformsJob: ["hh.ru", "Telegram-каналы с вакансиями", "Avito Работа", "Remote-job boards"],
    platformsClients: ["FL.ru", "Upwork", "Telegram-каналы заявок", "Партнёрства с агентствами"],
    platformText: "Платформы выбираются не вручную, а по вашему описанию, рынку и цели.",
    step4Title: "Что подготовить перед подбором?",
    resumeGenerate: "Собрать резюме с AI",
    resumeUpload: "Загрузить готовое резюме",
    proposal: "Собрать профиль и предложение",
    resumeGenerateText: "Для поиска работы AI сделает резюме из вашего опыта и целей.",
    resumeUploadText: "Если резюме уже есть, AI разберёт его и улучшит под выбранные вакансии.",
    proposalText: "Для поиска клиентов AI сделает описание услуги, оффер и первый текст отклика.",
    finalTitle: "Freelectory готов начать подбор",
    finalText: "Теперь AI знает вашу цель, контекст, категорию и платформы. Дальше можно открыть ленту и получать карточки.",
    openFeed: "Открыть подбор",
    openResume: "Резюме и профиль",
  },
  en: {
    steps: ["Goal", "Tell AI", "Analysis", "Platforms", "Resume/profile", "Ready"],
    setup: "Personal match",
    sideText: "AI asks a few simple questions and chooses category, platforms, and next step.",
    telegram: "Telegram bonus",
    telegramText: "Connect Telegram and phone to get cards, reminders, and tokens.",
    cardDescription: "Do not choose complex categories manually. Explain the task naturally.",
    back: "Back",
    next: "Continue",
    done: "Done",
    step0Title: "What do you want to get?",
    jobTitle: "Find a job",
    jobText: "AI helps understand the right role, where to search, and what resume is needed.",
    clientsTitle: "Find clients",
    clientsText: "AI understands what you sell, who needs it, and where to find leads.",
    step1Title: "Tell AI what you can do or who you need",
    step1Text:
      "Write like you would to a person. For example: “I build real estate websites”, “I need repair clients”, “I want a job with no experience”, “I need designers for a project”.",
    voice: "Speak by voice",
    typedLabel: "Text for AI",
    typedPlaceholder: "Write naturally: what you can do, who you need, what result you want...",
    sampleJob: "I can talk to clients, know a bit of Excel, want remote work without experience, and do not know which jobs fit me.",
    sampleClients: "I build websites and ads for real estate. I want developer or realtor clients, but I do not know where to find leads.",
    step2Title: "AI analyzes and suggests direction",
    category: "Category",
    categoryJob: "Admin / support / junior sales",
    categoryClients: "Real estate: websites, lead generation, CRM",
    why: "Why",
    whyJob: "Your description fits communication-heavy roles with basic spreadsheets and fast learning.",
    whyClients: "You sell a clear business result: leads and websites for real estate objects.",
    edit: "You can refine the AI answer later",
    step3Title: "AI chooses platforms",
    platformsJob: ["LinkedIn Jobs", "Telegram job channels", "Indeed", "Remote job boards"],
    platformsClients: ["Upwork", "Freelance marketplaces", "Telegram lead channels", "Agency partnerships"],
    platformText: "Platforms are selected by AI from your description, market, and goal.",
    step4Title: "What should we prepare before matching?",
    resumeGenerate: "Create resume with AI",
    resumeUpload: "Upload existing resume",
    proposal: "Create profile and offer",
    resumeGenerateText: "For job search AI creates a resume from your experience and goals.",
    resumeUploadText: "If you already have a resume, AI parses and improves it for selected jobs.",
    proposalText: "For client search AI creates service description, offer, and first reply.",
    finalTitle: "Freelectory is ready to match",
    finalText: "AI now knows your goal, context, category, and platforms. Open the feed and start receiving cards.",
    openFeed: "Open matches",
    openResume: "Resume and profile",
  },
};

export function OnboardingFlow() {
  const { language } = useLanguage();
  const t = dictionaries[language];
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<Goal>("clients");
  const [description, setDescription] = useState("");
  const [resumeMode, setResumeMode] = useState<ResumeMode>("proposal");

  const progress = useMemo(() => Math.round(((step + 1) / t.steps.length) * 100), [step, t.steps.length]);
  const platforms = goal === "job" ? t.platformsJob : t.platformsClients;
  const category = goal === "job" ? t.categoryJob : t.categoryClients;
  const why = goal === "job" ? t.whyJob : t.whyClients;
  const sample = goal === "job" ? t.sampleJob : t.sampleClients;

  return (
    <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[320px_1fr] lg:px-6">
      <aside className="rounded-lg border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Zap className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold">Freelectory</span>
          </Link>
          <PublicControls />
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{t.setup}</span>
            <span className="text-muted-foreground">{progress}%</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-secondary">
            <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">{t.sideText}</p>
        </div>

        <div className="mt-6 space-y-1">
          {t.steps.map((item, index) => (
            <button
              key={item}
              onClick={() => setStep(index)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                index === step && "bg-secondary text-foreground",
                index < step && "text-foreground"
              )}
            >
              <span className={cn("flex h-5 w-5 items-center justify-center rounded-full border text-[11px]", index <= step && "border-primary bg-primary text-primary-foreground")}>
                {index < step ? <Check className="h-3 w-3" /> : index + 1}
              </span>
              {item}
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-lg border bg-muted/35 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Bot className="h-4 w-4" />
            {t.telegram}
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{t.telegramText}</p>
        </div>
      </aside>

      <main>
        <Card className="min-h-[680px]">
          <CardHeader className="border-b">
            <CardTitle className="text-2xl">{t.steps[step]}</CardTitle>
            <CardDescription>{t.cardDescription}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {step === 0 && (
              <div>
                <h3 className="mb-4 text-xl font-semibold">{t.step0Title}</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <ChoiceCard active={goal === "job"} icon={BriefcaseBusiness} title={t.jobTitle} text={t.jobText} onClick={() => { setGoal("job"); setResumeMode("generate"); }} />
                  <ChoiceCard active={goal === "clients"} icon={UsersRound} title={t.clientsTitle} text={t.clientsText} onClick={() => { setGoal("clients"); setResumeMode("proposal"); }} />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
                <div>
                  <h3 className="text-xl font-semibold">{t.step1Title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{t.step1Text}</p>
                  <div className="mt-5 rounded-lg border bg-muted/30 p-3">
                    <label className="text-sm font-semibold">{t.typedLabel}</label>
                    <textarea
                      className="mt-3 min-h-40 w-full resize-none rounded-md border bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder={t.typedPlaceholder}
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                    />
                  </div>
                  <Button className="mt-4" variant="secondary" onClick={() => setDescription(sample)}>
                    <Sparkles className="h-4 w-4" />
                    {language === "ru" ? "Вставить пример" : "Use example"}
                  </Button>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Mic className="h-4 w-4" />
                      {t.voice}
                    </CardTitle>
                    <CardDescription>{language === "ru" ? "В MVP это макет голосового ввода. Дальше подключается Web Speech API или Telegram voice." : "In this MVP this is a voice input mock. Later it can use Web Speech API or Telegram voice."}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <Mic className="h-4 w-4" />
                      {t.voice}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-xl font-semibold">{t.step2Title}</h3>
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <Card>
                    <CardContent className="p-5">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <div className="mt-4 text-sm text-muted-foreground">{t.category}</div>
                      <div className="mt-1 text-xl font-semibold">{category}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-5">
                      <Search className="h-5 w-5 text-primary" />
                      <div className="mt-4 text-sm text-muted-foreground">{t.why}</div>
                      <p className="mt-1 text-sm leading-6">{why}</p>
                    </CardContent>
                  </Card>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{t.edit}</p>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="text-xl font-semibold">{t.step3Title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{t.platformText}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {platforms.map((platform) => (
                    <Card key={platform}>
                      <CardContent className="p-4">
                        <Globe2 className="h-5 w-5 text-primary" />
                        <div className="mt-4 text-sm font-semibold">{platform}</div>
                        <p className="mt-2 text-xs leading-5 text-muted-foreground">{language === "ru" ? "Подходит под ваш запрос и рынок." : "Fits your request and market."}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h3 className="text-xl font-semibold">{t.step4Title}</h3>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <ChoiceCard active={resumeMode === "generate"} icon={FileText} title={t.resumeGenerate} text={t.resumeGenerateText} onClick={() => setResumeMode("generate")} />
                  <ChoiceCard active={resumeMode === "upload"} icon={Upload} title={t.resumeUpload} text={t.resumeUploadText} onClick={() => setResumeMode("upload")} />
                  <ChoiceCard active={resumeMode === "proposal"} icon={Paperclip} title={t.proposal} text={t.proposalText} onClick={() => setResumeMode("proposal")} />
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
                <div>
                  <h3 className="text-2xl font-semibold">{t.finalTitle}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{t.finalText}</p>
                  <div className="mt-6 grid gap-3">
                    {[goal === "job" ? t.jobTitle : t.clientsTitle, category, platforms.slice(0, 2).join(", "), resumeMode].map((item) => (
                      <div key={item} className="flex items-center gap-3 rounded-md border p-3 text-sm">
                        <Check className="h-4 w-4 text-success" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>{language === "ru" ? "Следующий шаг" : "Next step"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full">
                      <Link href="/feed" className="flex items-center gap-2">
                        {t.openFeed} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Link href="/profile/resumes">{t.openResume}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="mt-8 flex justify-between border-t pt-5">
              <Button variant="outline" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>
                {t.back}
              </Button>
              <Button onClick={() => setStep((value) => Math.min(t.steps.length - 1, value + 1))}>
                {step === t.steps.length - 1 ? t.done : t.next}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function ChoiceCard({
  active,
  icon: Icon,
  title,
  text,
  onClick,
}: {
  active: boolean;
  icon: ComponentType<{ className?: string }>;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-lg border bg-card p-5 text-left transition-colors hover:bg-muted",
        active && "border-primary bg-accent text-accent-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      <div className="mt-4 font-semibold">{title}</div>
      <p className="mt-2 text-sm leading-6 opacity-75">{text}</p>
    </button>
  );
}

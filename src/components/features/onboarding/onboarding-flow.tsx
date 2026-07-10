"use client";

import { useMemo, useState } from "react";
import type { ComponentType } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ClipboardPaste,
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
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Goal = "job" | "clients";
type Market = "cis" | "global";
type ResumeMode = "generate" | "upload" | "proposal";
type Lang = "ru" | "en";

type Platform = {
  id: string;
  name: string;
  note: string;
  source: string;
};

type Analysis = {
  category: string;
  task: string;
  filters: string[];
  recommended: string[];
  resumeTitle: string;
  resumeSummary: string;
  offer: string;
};

const platformCatalog: Record<Market, Platform[]> = {
  cis: [
    { id: "hh", name: "hh.ru", note: "Вакансии, фильтр по роли и опыту", source: "Официальное API/парсинг позже" },
    { id: "habr", name: "Хабр Карьера", note: "IT-вакансии и разработчики", source: "Публичные вакансии" },
    { id: "fl", name: "FL.ru", note: "Фриланс-проекты", source: "Площадка/парсер позже" },
    { id: "kwork", name: "Kwork", note: "Пакетные услуги и быстрые заказы", source: "Площадка/парсер позже" },
    { id: "telegram", name: "Telegram", note: "Каналы вакансий и заявок", source: "Ваш Telegram-бот" },
    { id: "avito", name: "Avito", note: "Работа и локальные услуги", source: "Интеграция позже" },
  ],
  global: [
    { id: "upwork", name: "Upwork", note: "Запросы через API/бота, не напрямую в ленту без интеграции", source: "API-бот Upwork" },
    { id: "linkedin", name: "LinkedIn", note: "Вакансии, лиды, outbound", source: "OAuth/API позже" },
    { id: "remoteok", name: "Remote OK", note: "Remote IT-вакансии", source: "Публичный источник" },
    { id: "wellfound", name: "Wellfound", note: "Стартапы и remote роли", source: "Интеграция позже" },
    { id: "contra", name: "Contra", note: "Портфолио и freelance", source: "Интеграция позже" },
    { id: "telegram-global", name: "Telegram Global", note: "Англоязычные каналы", source: "Ваш Telegram-бот" },
  ],
};

const copy = {
  ru: {
    steps: ["Цель", "Рассказ", "Рынок", "Платформы", "Резюме/оффер", "Готово"],
    setup: "Настройка подбора",
    description: "Сначала цель, потом голос или текст. Freelectory определяет категорию, задачи, фильтры и предлагает площадки, но вы можете выбрать всё вручную.",
    back: "Назад",
    next: "Продолжить",
    done: "Готово",
    goalTitle: "Кого ищем?",
    job: "Ищу работу",
    jobText: "Вакансии, резюме, роли, фильтры по опыту и рынку.",
    clients: "Ищу клиентов",
    clientsText: "Заявки, проекты, площадки, оффер и CRM.",
    tellTitle: "Расскажите Freelectory, что вы хотите",
    tellText: "Можно сказать голосом или вставить текст из буфера обмена. Пример-кнопки больше нет: система работает с вашим текстом.",
    voice: "Сказать голосом",
    stopVoice: "Слушаю...",
    paste: "Вставить из буфера",
    placeholder: "Например: хочу заниматься IT, хочу клиентов на разработку сайтов, ищу работу в поддержке, умею продавать и хочу удалёнку...",
    marketTitle: "Рынок и фильтры",
    market: "Рынок",
    cis: "СНГ / русский рынок",
    global: "Западный / Global",
    category: "Категория",
    task: "Задача",
    filters: "Фильтры для площадок",
    platformsTitle: "Выберите площадки",
    suggested: "Предложенные",
    source: "Источник",
    resumeTitle: "Что подготовить?",
    generateResume: "Сгенерировать резюме",
    uploadResume: "Загрузить резюме",
    generateOffer: "Сгенерировать профиль и оффер",
    preview: "Черновик",
    finalTitle: "Подбор готов",
    openFeed: "Открыть reels-ленту",
    openSettings: "Подтвердить телефон в Telegram",
    noText: "Пока нет текста. Нажмите микрофон, вставьте из буфера или напечатайте запрос.",
  },
  en: {
    steps: ["Goal", "Story", "Market", "Platforms", "Resume/offer", "Ready"],
    setup: "Matching setup",
    description: "Start with a goal, then speak or type. Freelectory detects category, tasks, filters, and suggests platforms, but you can choose manually.",
    back: "Back",
    next: "Continue",
    done: "Done",
    goalTitle: "What are we looking for?",
    job: "Find a job",
    jobText: "Jobs, resume, roles, experience and market filters.",
    clients: "Find clients",
    clientsText: "Leads, projects, platforms, offer, and CRM.",
    tellTitle: "Tell Freelectory what you want",
    tellText: "Speak by voice or paste from clipboard. No sample button: the system works with your text.",
    voice: "Speak",
    stopVoice: "Listening...",
    paste: "Paste from clipboard",
    placeholder: "Example: I want IT, I want clients for websites, I need support jobs, I can sell and want remote work...",
    marketTitle: "Market and filters",
    market: "Market",
    cis: "CIS / Russian market",
    global: "Western / Global",
    category: "Category",
    task: "Task",
    filters: "Platform filters",
    platformsTitle: "Choose platforms",
    suggested: "Suggested",
    source: "Source",
    resumeTitle: "What should we prepare?",
    generateResume: "Generate resume",
    uploadResume: "Upload resume",
    generateOffer: "Generate profile and offer",
    preview: "Draft",
    finalTitle: "Matching is ready",
    openFeed: "Open reels feed",
    openSettings: "Verify phone in Telegram",
    noText: "No text yet. Use microphone, paste from clipboard, or type your request.",
  },
};

const contains = (text: string, words: string[]) => words.some((word) => text.includes(word));

function analyze(goal: Goal, textValue: string, market: Market, language: Lang): Analysis {
  const ru = language === "ru";
  const text = textValue.toLowerCase();
  if (!text.trim()) {
    return {
      category: ru ? "Ожидаю описание" : "Waiting for description",
      task: ru ? "Сначала нужен ваш запрос" : "Your request is needed first",
      filters: [],
      recommended: market === "global" ? ["upwork", "linkedin", "remoteok"] : ["hh", "habr", "telegram"],
      resumeTitle: ru ? "Черновик появится после рассказа" : "Draft appears after your story",
      resumeSummary: ru ? copy.ru.noText : copy.en.noText,
      offer: ru ? copy.ru.noText : copy.en.noText,
    };
  }

  const isIt = contains(text, ["it", "айти", "разработ", "сайт", "программ", "код", "frontend", "backend", "qa", "crm", "автоматиза"]);
  const isSales = contains(text, ["продаж", "sales", "клиент", "лиды", "lead"]);
  const isDesign = contains(text, ["дизайн", "figma", "ux", "ui", "бренд"]);
  const isMarketing = contains(text, ["smm", "маркет", "реклам", "seo", "контент", "ads"]);

  if (isIt) {
    return {
      category: goal === "job" ? (ru ? "IT: разработка, QA, поддержка или junior digital" : "IT: development, QA, support, or junior digital") : ru ? "IT-услуги: сайты, автоматизация, CRM, поддержка" : "IT services: websites, automation, CRM, support",
      task: goal === "job" ? (ru ? "Найти подходящие IT-вакансии и стартовую роль" : "Find suitable IT jobs and entry role") : ru ? "Найти проекты на разработку и поддержку" : "Find development and support projects",
      filters: goal === "job" ? ["IT", "remote", "junior/middle", "React/QA/support"] : ["development", "websites", "automation", "CRM", "budget"],
      recommended: market === "global" ? ["upwork", "linkedin", "remoteok", "wellfound"] : ["habr", "hh", "fl", "kwork", "telegram"],
      resumeTitle: ru ? "IT-профиль" : "IT profile",
      resumeSummary: ru ? "Резюме: цель, стек, учебные проекты, опыт, готовность учиться, формат remote." : "Resume: goal, stack, learning projects, experience, learning speed, remote format.",
      offer: ru ? "Оффер: помогаю запускать сайты, автоматизацию и поддержку, быстро довожу до понятного результата." : "Offer: I help launch websites, automation, and support with clear delivery.",
    };
  }

  if (isDesign) {
    return {
      category: ru ? "Дизайн: UI/UX, Figma, продуктовые интерфейсы" : "Design: UI/UX, Figma, product interfaces",
      task: goal === "job" ? (ru ? "Найти роли дизайнера" : "Find design roles") : ru ? "Найти клиентов на дизайн" : "Find design clients",
      filters: ["Figma", "UI/UX", "portfolio", "SaaS", "landing"],
      recommended: market === "global" ? ["upwork", "contra", "linkedin"] : ["fl", "kwork", "telegram"],
      resumeTitle: ru ? "Дизайн-профиль" : "Design profile",
      resumeSummary: ru ? "Резюме: портфолио, кейсы, процесс, инструменты, метрики." : "Resume: portfolio, cases, process, tools, metrics.",
      offer: ru ? "Оффер: проектирую понятные интерфейсы, лендинги и дизайн-системы." : "Offer: I design clear interfaces, landing pages, and design systems.",
    };
  }

  if (isMarketing || isSales) {
    return {
      category: ru ? "Маркетинг и продажи" : "Marketing and sales",
      task: goal === "job" ? (ru ? "Найти роли в продажах, SMM или трафике" : "Find sales, SMM, or ads roles") : ru ? "Найти клиентов на лиды и продвижение" : "Find clients for leads and promotion",
      filters: ["leads", "sales", "ads", "SMM", "conversion"],
      recommended: market === "global" ? ["upwork", "linkedin", "contra"] : ["kwork", "telegram", "avito", "fl"],
      resumeTitle: ru ? "Профиль маркетолога/продажника" : "Marketing/sales profile",
      resumeSummary: ru ? "Резюме: каналы, результаты, заявки, бюджеты, CRM." : "Resume: channels, results, leads, budgets, CRM.",
      offer: ru ? "Оффер: помогаю получать заявки и доводить клиентов до сделки." : "Offer: I help get leads and move clients toward a deal.",
    };
  }

  return {
    category: goal === "job" ? (ru ? "Универсальная роль" : "General role") : ru ? "Услуга требует уточнения" : "Service needs clarification",
    task: ru ? "Сузить нишу и подобрать первые площадки" : "Narrow the niche and pick first platforms",
    filters: ["remote", "entry", "communication", "quick start"],
    recommended: market === "global" ? ["linkedin", "upwork", "remoteok"] : ["hh", "telegram", "avito"],
    resumeTitle: ru ? "Универсальный профиль" : "General profile",
    resumeSummary: ru ? "Резюме: сильные стороны, опыт, цели, формат работы." : "Resume: strengths, experience, goals, work format.",
    offer: ru ? "Оффер станет точнее после пары уточнений." : "Offer becomes more precise after a few clarifications.",
  };
}

export function OnboardingFlow() {
  const { language } = useLanguage();
  const t = copy[language];
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<Goal>("clients");
  const [market, setMarket] = useState<Market>("cis");
  const [description, setDescription] = useState("");
  const [resumeMode, setResumeMode] = useState<ResumeMode>("proposal");
  const [listening, setListening] = useState(false);
  const analysis = useMemo(() => analyze(goal, description, market, language), [goal, description, market, language]);
  const [manualPlatforms, setManualPlatforms] = useState<string[]>([]);
  const selectedPlatforms = manualPlatforms.length ? manualPlatforms : analysis.recommended;
  const progress = Math.round(((step + 1) / t.steps.length) * 100);

  const togglePlatform = (id: string) => {
    setManualPlatforms((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));
  };

  const pasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setDescription(text);
    } catch {
      setDescription((value) => value || "");
    }
  };

  const startVoice = () => {
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition
      ?? (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = language === "ru" ? "ru-RU" : "en-US";
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      const text = event.results[0]?.[0]?.transcript ?? "";
      if (text) setDescription((value) => `${value ? `${value} ` : ""}${text}`);
    };
    recognition.start();
  };

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
          <p className="mt-3 text-xs leading-5 text-muted-foreground">{t.description}</p>
        </div>
        <div className="mt-6 space-y-1">
          {t.steps.map((item, index) => (
            <button key={item} onClick={() => setStep(index)} className={cn("flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground", index === step && "bg-secondary text-foreground")}>
              <span className={cn("flex h-5 w-5 items-center justify-center rounded-full border text-[11px]", index <= step && "border-primary bg-primary text-primary-foreground")}>
                {index < step ? <Check className="h-3 w-3" /> : index + 1}
              </span>
              {item}
            </button>
          ))}
        </div>
      </aside>

      <main>
        <Card className="min-h-[680px]">
          <CardHeader className="border-b">
            <CardTitle className="text-2xl">{t.steps[step]}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {step === 0 && (
              <div>
                <h3 className="mb-4 text-xl font-semibold">{t.goalTitle}</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <ChoiceCard active={goal === "job"} icon={BriefcaseBusiness} title={t.job} text={t.jobText} onClick={() => { setGoal("job"); setResumeMode("generate"); }} />
                  <ChoiceCard active={goal === "clients"} icon={UsersRound} title={t.clients} text={t.clientsText} onClick={() => { setGoal("clients"); setResumeMode("proposal"); }} />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-5 lg:grid-cols-[1fr_0.75fr]">
                <div>
                  <h3 className="text-xl font-semibold">{t.tellTitle}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{t.tellText}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button onClick={startVoice} disabled={listening}>
                      <Mic className="h-4 w-4" />
                      {listening ? t.stopVoice : t.voice}
                    </Button>
                    <Button variant="outline" onClick={pasteClipboard}>
                      <ClipboardPaste className="h-4 w-4" />
                      {t.paste}
                    </Button>
                  </div>
                  <textarea className="mt-4 min-h-56 w-full resize-none rounded-md border bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder={t.placeholder} value={description} onChange={(event) => setDescription(event.target.value)} />
                </div>
                <AnalysisPanel t={t} analysis={analysis} />
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-5 lg:grid-cols-[0.75fr_1fr]">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{t.marketTitle}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <label className="text-sm font-semibold">{t.market}</label>
                    <Select value={market} onChange={(event) => { setMarket(event.target.value as Market); setManualPlatforms([]); }}>
                      <option value="cis">{t.cis}</option>
                      <option value="global">{t.global}</option>
                    </Select>
                  </CardContent>
                </Card>
                <AnalysisPanel t={t} analysis={analysis} />
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="text-xl font-semibold">{t.platformsTitle}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.suggested}: {analysis.recommended.map((id) => platformCatalog[market].find((p) => p.id === id)?.name).filter(Boolean).join(", ")}</p>
                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {platformCatalog[market].map((platform) => (
                    <button key={platform.id} onClick={() => togglePlatform(platform.id)} className={cn("rounded-lg border bg-card p-4 text-left transition-colors hover:bg-muted", selectedPlatforms.includes(platform.id) && "border-primary bg-accent text-accent-foreground")}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-semibold">{platform.name}</div>
                        {selectedPlatforms.includes(platform.id) && <Check className="h-4 w-4" />}
                      </div>
                      <p className="mt-2 text-sm leading-6 opacity-80">{platform.note}</p>
                      <p className="mt-3 text-xs text-muted-foreground">{t.source}: {platform.source}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h3 className="text-xl font-semibold">{t.resumeTitle}</h3>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <ChoiceCard active={resumeMode === "generate"} icon={FileText} title={t.generateResume} text={analysis.resumeSummary} onClick={() => setResumeMode("generate")} />
                  <ChoiceCard active={resumeMode === "upload"} icon={Upload} title={t.uploadResume} text="PDF/DOCX, позже AI разберёт файл и улучшит профиль." onClick={() => setResumeMode("upload")} />
                  <ChoiceCard active={resumeMode === "proposal"} icon={Paperclip} title={t.generateOffer} text={analysis.offer} onClick={() => setResumeMode("proposal")} />
                </div>
                <Card className="mt-5">
                  <CardHeader><CardTitle className="text-base">{t.preview}</CardTitle></CardHeader>
                  <CardContent>
                    <div className="rounded-lg border bg-muted/30 p-4">
                      <div className="text-sm font-semibold">{resumeMode === "proposal" ? analysis.offer : analysis.resumeTitle}</div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{resumeMode === "upload" ? "Здесь будет загрузка файла. Сейчас выбор сохранён как отдельный сценарий." : analysis.resumeSummary}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 5 && (
              <div className="grid gap-5 lg:grid-cols-[1fr_0.7fr]">
                <div>
                  <h3 className="text-2xl font-semibold">{t.finalTitle}</h3>
                  <div className="mt-5 grid gap-3">
                    {[goal === "job" ? t.job : t.clients, market === "global" ? t.global : t.cis, analysis.category, selectedPlatforms.map((id) => platformCatalog[market].find((p) => p.id === id)?.name).filter(Boolean).join(", ")].map((item) => (
                      <div key={item} className="flex items-center gap-3 rounded-md border p-3 text-sm">
                        <Check className="h-4 w-4 text-success" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <Card>
                  <CardContent className="space-y-3 p-5">
                    <Button className="w-full">
                      <Link href="/feed" className="flex items-center gap-2">{t.openFeed}<ArrowRight className="h-4 w-4" /></Link>
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Link href="/settings">{t.openSettings}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="mt-8 flex justify-between border-t pt-5">
              <Button variant="outline" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>{t.back}</Button>
              <Button onClick={() => setStep((value) => Math.min(t.steps.length - 1, value + 1))}>{step === t.steps.length - 1 ? t.done : t.next}<ArrowRight className="h-4 w-4" /></Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

type SpeechRecognitionEventLike = { results: ArrayLike<ArrayLike<{ transcript: string }>> };
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  start: () => void;
};

function AnalysisPanel({ t, analysis }: { t: typeof copy.ru; analysis: Analysis }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base"><Sparkles className="h-4 w-4" />AI-анализ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Info label={t.category} value={analysis.category} icon={Search} />
        <Info label={t.task} value={analysis.task} icon={Globe2} />
        <div>
          <div className="text-sm font-semibold">{t.filters}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {analysis.filters.length ? analysis.filters.map((filter) => <span key={filter} className="rounded-md border bg-background px-2 py-1 text-xs">{filter}</span>) : <span className="text-sm text-muted-foreground">{analysis.resumeSummary}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Info({ icon: Icon, label, value }: { icon: ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/25 p-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><Icon className="h-4 w-4" />{label}</div>
      <div className="mt-2 text-sm font-medium leading-6">{value}</div>
    </div>
  );
}

function ChoiceCard({ active, icon: Icon, title, text, onClick }: { active: boolean; icon: ComponentType<{ className?: string }>; title: string; text: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("rounded-lg border bg-card p-5 text-left transition-colors hover:bg-muted", active && "border-primary bg-accent text-accent-foreground")}>
      <Icon className="h-5 w-5" />
      <div className="mt-4 font-semibold">{title}</div>
      <p className="mt-2 text-sm leading-6 opacity-75">{text}</p>
    </button>
  );
}

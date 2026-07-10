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
type Lang = "ru" | "en";

type Analysis = {
  category: string;
  why: string;
  market: string;
  platforms: string[];
  resumeTitle: string;
  resumeSummary: string;
  strengths: string[];
  offer: string;
  empty: boolean;
};

const dictionaries = {
  ru: {
    steps: ["Цель", "Рассказ AI", "Анализ", "Платформы", "Резюме/профиль", "Готово"],
    setup: "Персональный подбор",
    sideText: "Freelectory не заставляет выбирать категории вручную. Вы объясняете задачу своими словами, а система предлагает направление.",
    telegram: "Telegram позже",
    telegramText: "Телефон не нужен для входа. Telegram-бот можно подключить позже для уведомлений и бонусных токенов.",
    cardDescription: "Сценарий начинается после входа. Дальше цель, объяснение своими словами и подбор.",
    back: "Назад",
    next: "Продолжить",
    done: "Готово",
    step0Title: "Что вы хотите получить?",
    jobTitle: "Ищу работу",
    jobText: "Система поймёт, какая роль подходит, где искать вакансии и какое резюме подготовить.",
    clientsTitle: "Ищу клиентов",
    clientsText: "Система поймёт, какую услугу вы продаёте, кому она нужна и где искать заявки.",
    step1Title: "Расскажите, что вы умеете или кого хотите найти",
    step1Text: "Напишите как человеку. Например: хочу заниматься IT, умею общаться с клиентами, делаю ремонт, ищу дизайнеров на проект.",
    voice: "Сказать голосом",
    voiceText: "В MVP голосовой ввод показан как следующий шаг. В рабочей версии сюда подключается Web Speech API или голосовые сообщения Telegram.",
    typedLabel: "Ваш рассказ для AI",
    typedPlaceholder: "Напишите обычными словами: что умеете, чем хотите заниматься, каких клиентов или работу ищете, какой результат нужен...",
    sampleJob: "Хочу заниматься IT. Немного знаю компьютеры, готов учиться, хочу удалённую работу и не понимаю, с какой роли начать.",
    sampleClients: "Я делаю сайты и простую автоматизацию для бизнеса. Хочу найти клиентов на разработку, поддержку и CRM.",
    useExample: "Вставить пример",
    step2Title: "Анализ по вашему тексту",
    category: "Направление",
    market: "Рынок",
    why: "Почему так",
    emptyCategory: "Опишите задачу, и Freelectory предложит направление",
    emptyWhy: "Пока нет текста, система не должна подставлять случайную категорию.",
    edit: "Если результат не подходит, вернитесь на шаг назад и уточните рассказ.",
    step3Title: "Подходящие платформы",
    platformText: "Платформы меняются по тексту, цели и рынку. Это не фиксированный список.",
    step4Title: "Что подготовить перед подбором?",
    resumeGenerate: "Собрать резюме с AI",
    resumeUpload: "Загрузить готовое резюме",
    proposal: "Собрать профиль и оффер",
    resumeGenerateText: "AI собирает черновик резюме из вашего рассказа и выбранного направления.",
    resumeUploadText: "Вы загружаете PDF/DOCX, а AI разбирает опыт и улучшает под выбранные карточки.",
    proposalText: "Для поиска клиентов AI делает описание услуги, оффер и первый текст отклика.",
    preview: "Предпросмотр",
    uploadTitle: "Зона загрузки резюме",
    uploadText: "Здесь будет загрузка PDF/DOCX. Сейчас MVP показывает отдельный сценарий, чтобы выбор не выглядел одинаково.",
    finalTitle: "Freelectory готов начать подбор",
    finalText: "Теперь система знает цель, ваш контекст, направление, рынок и первый способ подготовки профиля.",
    openFeed: "Открыть подбор",
    openResume: "Резюме и профиль",
    nextStep: "Следующий шаг",
  },
  en: {
    steps: ["Goal", "Tell AI", "Analysis", "Platforms", "Resume/profile", "Ready"],
    setup: "Personal match",
    sideText: "Freelectory does not force manual category picking. Explain the task naturally and the system suggests direction.",
    telegram: "Telegram later",
    telegramText: "Phone is not needed for sign-in. Telegram bot can be connected later for notifications and bonus tokens.",
    cardDescription: "The flow starts after sign-in: goal, natural explanation, then matching.",
    back: "Back",
    next: "Continue",
    done: "Done",
    step0Title: "What do you want to get?",
    jobTitle: "Find a job",
    jobText: "The system understands the right role, job boards, and resume type.",
    clientsTitle: "Find clients",
    clientsText: "The system understands your service, buyer, and lead sources.",
    step1Title: "Tell AI what you can do or who you need",
    step1Text: "Write naturally. For example: I want IT, I talk to clients, I do repairs, I need designers for a project.",
    voice: "Speak by voice",
    voiceText: "Voice input is shown as the next MVP step. Production can use Web Speech API or Telegram voice messages.",
    typedLabel: "Your text for AI",
    typedPlaceholder: "Write naturally: what you can do, what job or clients you need, what result you want...",
    sampleJob: "I want to work in IT. I know computers a little, I am ready to learn, and I want remote work but do not know where to start.",
    sampleClients: "I build websites and simple automation for businesses. I want clients for development, support, and CRM.",
    useExample: "Use example",
    step2Title: "Analysis from your text",
    category: "Direction",
    market: "Market",
    why: "Why",
    emptyCategory: "Describe the task and Freelectory will suggest a direction",
    emptyWhy: "Without text, the system should not insert a random category.",
    edit: "If the result is wrong, go back and clarify your text.",
    step3Title: "Suitable platforms",
    platformText: "Platforms change by text, goal, and market. This is not a fixed list.",
    step4Title: "What should we prepare before matching?",
    resumeGenerate: "Create resume with AI",
    resumeUpload: "Upload existing resume",
    proposal: "Create profile and offer",
    resumeGenerateText: "AI drafts a resume from your text and selected direction.",
    resumeUploadText: "You upload PDF/DOCX, AI parses and improves it for selected cards.",
    proposalText: "For client search AI creates service description, offer, and first reply.",
    preview: "Preview",
    uploadTitle: "Resume upload area",
    uploadText: "PDF/DOCX upload will be here. The MVP now shows a distinct branch for this choice.",
    finalTitle: "Freelectory is ready to match",
    finalText: "The system now knows your goal, context, direction, market, and first profile preparation mode.",
    openFeed: "Open matches",
    openResume: "Resume and profile",
    nextStep: "Next step",
  },
};

const hasAny = (text: string, words: string[]) => words.some((word) => text.includes(word));

function analyzeDescription(goal: Goal, description: string, language: Lang): Analysis {
  const text = description.trim().toLowerCase();
  const ru = language === "ru";
  const empty = text.length < 3;
  const globalMarket = hasAny(text, ["english", "англ", "upwork", "remote", "global", "usa", "европа", "europe", "доллар", "$"]);
  const market = globalMarket ? (ru ? "Глобальный / remote" : "Global / remote") : ru ? "СНГ / русский рынок" : "Local / CIS";

  if (empty) {
    return {
      category: ru ? dictionaries.ru.emptyCategory : dictionaries.en.emptyCategory,
      why: ru ? dictionaries.ru.emptyWhy : dictionaries.en.emptyWhy,
      market,
      platforms: ru ? ["hh.ru", "Avito", "Telegram", "Kwork"] : ["LinkedIn", "Indeed", "Upwork", "Telegram"],
      resumeTitle: ru ? "Черновик появится после описания" : "Draft appears after description",
      resumeSummary: ru ? "Сначала напишите, что вы умеете или кого ищете." : "First describe what you can do or who you need.",
      strengths: [],
      offer: ru ? "Оффер появится после анализа." : "Offer appears after analysis.",
      empty: true,
    };
  }

  const isIt = hasAny(text, [
    "it",
    "айти",
    "программ",
    "разработ",
    "код",
    "сайт",
    "прилож",
    "frontend",
    "backend",
    "react",
    "дизайн",
    "figma",
    "qa",
    "тестир",
    "crm",
    "автоматиза",
  ]);
  const isRealEstate = hasAny(text, ["недвиж", "риелтор", "застрой", "real estate", "realtor", "property"]);
  const isRepair = hasAny(text, ["ремонт", "стро", "сантех", "электрик", "repair", "construction"]);
  const isMarketing = hasAny(text, ["smm", "маркет", "реклам", "таргет", "копирайт", "контент", "seo", "ads"]);
  const isPeopleSearch = hasAny(text, ["ищу людей", "нужны", "нанять", "команда", "дизайнеры", "разработчики", "hire", "need people"]);

  if (isIt) {
    return {
      category:
        goal === "job"
          ? ru
            ? "IT: стартовая роль, поддержка, QA, frontend/backend или продукт"
            : "IT: entry role, support, QA, frontend/backend, or product"
          : ru
            ? "IT-услуги: разработка, автоматизация, сайты, CRM и поддержка"
            : "IT services: development, automation, websites, CRM, and support",
      why:
        goal === "job"
          ? ru
            ? "В тексте есть IT-намерение. Поэтому система предлагает не недвижимость, а роли, с которых можно войти в IT или развиваться в разработке."
            : "Your text contains IT intent, so the system suggests IT entry or development roles."
          : ru
            ? "Вы описали IT-услугу. Значит нужны площадки с проектами на разработку, поддержку, автоматизацию и сайты."
            : "You described an IT service, so matching should focus on development, support, automation, and website projects.",
      market,
      platforms:
        goal === "job"
          ? globalMarket
            ? ["LinkedIn Jobs", "Remote OK", "Wellfound", "Telegram IT Jobs"]
            : ["Хабр Карьера", "hh.ru", "Telegram IT-вакансии", "GeekJob"]
          : globalMarket
            ? ["Upwork", "Contra", "LinkedIn", "Indie Hackers"]
            : ["Kwork", "FL.ru", "Telegram-каналы заказов", "vc.ru"],
      resumeTitle: ru ? "IT-специалист / junior digital role" : "IT specialist / junior digital role",
      resumeSummary: ru ? "Подчеркнуть обучаемость, техническую базу, проекты и понятный результат для бизнеса." : "Highlight learning speed, technical basics, projects, and business outcomes.",
      strengths: ru ? ["быстрое обучение", "цифровые инструменты", "коммуникация с заказчиком"] : ["fast learning", "digital tools", "client communication"],
      offer: ru ? "Помогаю бизнесу запускать сайты, автоматизацию и поддержку без сложной технической рутины." : "I help businesses launch websites, automation, and support without technical friction.",
      empty: false,
    };
  }

  if (isRealEstate) {
    return {
      category: goal === "job" ? (ru ? "Недвижимость: продажи, поддержка, CRM" : "Real estate: sales, support, CRM") : ru ? "Недвижимость: лиды, сайты, CRM" : "Real estate: leads, websites, CRM",
      why: ru ? "В тексте есть недвижимость, поэтому направление выбрано осознанно, а не по умолчанию." : "Your text mentions real estate, so this is selected deliberately, not by default.",
      market,
      platforms: goal === "job" ? ["hh.ru", "Avito Работа", "Циан вакансии", "Telegram"] : ["Циан Pro", "Avito", "Telegram-чаты риелторов", "Kwork"],
      resumeTitle: ru ? "Специалист по недвижимости / CRM" : "Real estate / CRM specialist",
      resumeSummary: ru ? "Фокус на лидах, объектах, коммуникации и скорости обработки заявок." : "Focus on leads, listings, communication, and response speed.",
      strengths: ru ? ["лидогенерация", "CRM", "переговоры"] : ["lead generation", "CRM", "negotiation"],
      offer: ru ? "Помогаю получать заявки на объекты и быстрее доводить клиентов до сделки." : "I help generate property leads and move clients toward a deal faster.",
      empty: false,
    };
  }

  if (isRepair) {
    return {
      category: goal === "job" ? (ru ? "Сервис и ремонт: мастер, координатор, сметчик" : "Services and repair: technician, coordinator, estimator") : ru ? "Ремонт и услуги: заявки от частных клиентов" : "Repair and local services: private client leads",
      why: ru ? "Описание похоже на локальные услуги, где важны доверие, география, отзывы и быстрый отклик." : "This looks like local services where trust, location, reviews, and speed matter.",
      market,
      platforms: ["Avito", "Профи", "YouDo", "Telegram-чаты района"],
      resumeTitle: ru ? "Мастер / координатор услуг" : "Service specialist / coordinator",
      resumeSummary: ru ? "Показать опыт, аккуратность, сроки, гарантию и отзывы." : "Show experience, accuracy, timing, warranty, and reviews.",
      strengths: ru ? ["сроки", "качество", "локальные заявки"] : ["timing", "quality", "local leads"],
      offer: ru ? "Беру заявки на ремонт, быстро оцениваю объём и довожу работу до результата." : "I take repair leads, estimate quickly, and deliver the work.",
      empty: false,
    };
  }

  if (isMarketing) {
    return {
      category: goal === "job" ? (ru ? "Маркетинг: SMM, трафик, контент, аналитика" : "Marketing: SMM, ads, content, analytics") : ru ? "Маркетинг: реклама, контент, лидогенерация" : "Marketing: ads, content, lead generation",
      why: ru ? "В тексте есть маркетинговые навыки, поэтому площадки должны давать проекты на продвижение, а не случайные вакансии." : "Your text mentions marketing skills, so platforms should focus on promotion projects.",
      market,
      platforms: globalMarket ? ["Upwork", "LinkedIn", "Contra", "MarketerHire"] : ["Kwork", "FL.ru", "Telegram-каналы", "TenChat"],
      resumeTitle: ru ? "Маркетолог / SMM / traffic specialist" : "Marketer / SMM / traffic specialist",
      resumeSummary: ru ? "Собрать кейсы, метрики, бюджеты и рост заявок." : "Collect cases, metrics, budgets, and lead growth.",
      strengths: ru ? ["креативы", "аналитика", "лиды"] : ["creatives", "analytics", "leads"],
      offer: ru ? "Помогаю бизнесу получать заявки через рекламу, контент и понятную аналитику." : "I help businesses get leads through ads, content, and clear analytics.",
      empty: false,
    };
  }

  if (isPeopleSearch) {
    return {
      category: ru ? "Подбор исполнителей и проектная команда" : "Contractor search and project team",
      why: ru ? "Вы описали не навык, а потребность найти людей. Поэтому система подбирает площадки для поиска исполнителей." : "You described a need to find people, so the system selects contractor sourcing platforms.",
      market,
      platforms: globalMarket ? ["LinkedIn", "Upwork", "Contra", "Telegram communities"] : ["Telegram-чаты", "Хабр Фриланс", "FL.ru", "vc.ru"],
      resumeTitle: ru ? "Проектный бриф" : "Project brief",
      resumeSummary: ru ? "Сформулировать задачу, бюджет, сроки, критерии выбора и первый отклик." : "Define task, budget, timeline, selection criteria, and first outreach.",
      strengths: ru ? ["бриф", "оценка", "поиск исполнителей"] : ["brief", "estimation", "contractor search"],
      offer: ru ? "Нужны исполнители под проект: Freelectory поможет собрать понятный бриф и найти кандидатов." : "Need contractors: Freelectory helps prepare a clear brief and find candidates.",
      empty: false,
    };
  }

  return {
    category: goal === "job" ? (ru ? "Универсальная стартовая роль: поддержка, продажи, администрирование" : "General entry role: support, sales, operations") : ru ? "Универсальная услуга: уточнить нишу и оффер" : "General service: clarify niche and offer",
    why: ru ? "Текст пока широкий. Система предлагает безопасное направление и попросит уточнить нишу перед лентой." : "The text is broad, so the system suggests a safe direction and will ask to clarify the niche before feed.",
    market,
    platforms: goal === "job" ? ["hh.ru", "Avito Работа", "Telegram", "LinkedIn"] : ["Kwork", "Avito", "Telegram", "FL.ru"],
    resumeTitle: ru ? "Универсальный профиль" : "General profile",
    resumeSummary: ru ? "Собрать сильные стороны, опыт, цели и понятный формат работы." : "Collect strengths, experience, goals, and working format.",
    strengths: ru ? ["коммуникация", "организация", "готовность учиться"] : ["communication", "organization", "learning readiness"],
    offer: ru ? "Опишите задачу подробнее, и Freelectory сузит категорию и площадки." : "Describe the task in more detail and Freelectory will narrow category and platforms.",
    empty: false,
  };
}

export function OnboardingFlow() {
  const { language } = useLanguage();
  const t = dictionaries[language];
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<Goal>("clients");
  const [description, setDescription] = useState("");
  const [resumeMode, setResumeMode] = useState<ResumeMode>("proposal");

  const analysis = useMemo(() => analyzeDescription(goal, description, language), [goal, description, language]);
  const progress = useMemo(() => Math.round(((step + 1) / t.steps.length) * 100), [step, t.steps.length]);
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
                    {t.useExample}
                  </Button>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Mic className="h-4 w-4" />
                      {t.voice}
                    </CardTitle>
                    <CardDescription>{t.voiceText}</CardDescription>
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
                <div className="mt-5 grid gap-4 lg:grid-cols-3">
                  <InfoCard icon={Sparkles} label={t.category} value={analysis.category} />
                  <InfoCard icon={Globe2} label={t.market} value={analysis.market} />
                  <Card>
                    <CardContent className="p-5">
                      <Search className="h-5 w-5 text-primary" />
                      <div className="mt-4 text-sm text-muted-foreground">{t.why}</div>
                      <p className="mt-1 text-sm leading-6">{analysis.why}</p>
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
                  {analysis.platforms.map((platform) => (
                    <Card key={platform}>
                      <CardContent className="p-4">
                        <Globe2 className="h-5 w-5 text-primary" />
                        <div className="mt-4 text-sm font-semibold">{platform}</div>
                        <p className="mt-2 text-xs leading-5 text-muted-foreground">
                          {language === "ru" ? "Подобрано по вашему описанию и цели." : "Selected from your text and goal."}
                        </p>
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
                <ResumePreview mode={resumeMode} analysis={analysis} labels={{ preview: t.preview, uploadTitle: t.uploadTitle, uploadText: t.uploadText }} />
              </div>
            )}

            {step === 5 && (
              <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
                <div>
                  <h3 className="text-2xl font-semibold">{t.finalTitle}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{t.finalText}</p>
                  <div className="mt-6 grid gap-3">
                    {[goal === "job" ? t.jobTitle : t.clientsTitle, analysis.category, analysis.market, analysis.platforms.slice(0, 2).join(", ")].map((item) => (
                      <div key={item} className="flex items-center gap-3 rounded-md border p-3 text-sm">
                        <Check className="h-4 w-4 text-success" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>{t.nextStep}</CardTitle>
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

function InfoCard({ icon: Icon, label, value }: { icon: ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <Icon className="h-5 w-5 text-primary" />
        <div className="mt-4 text-sm text-muted-foreground">{label}</div>
        <div className="mt-1 text-lg font-semibold leading-7">{value}</div>
      </CardContent>
    </Card>
  );
}

function ResumePreview({ mode, analysis, labels }: { mode: ResumeMode; analysis: Analysis; labels: { preview: string; uploadTitle: string; uploadText: string } }) {
  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle className="text-base">{labels.preview}</CardTitle>
      </CardHeader>
      <CardContent>
        {mode === "upload" ? (
          <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-center">
            <Upload className="mx-auto h-6 w-6 text-primary" />
            <div className="mt-3 font-semibold">{labels.uploadTitle}</div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{labels.uploadText}</p>
          </div>
        ) : mode === "proposal" ? (
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="text-sm font-semibold">{analysis.category}</div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{analysis.offer}</p>
          </div>
        ) : (
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="text-sm font-semibold">{analysis.resumeTitle}</div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{analysis.resumeSummary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {analysis.strengths.map((strength) => (
                <span key={strength} className="rounded-md border bg-background px-2 py-1 text-xs">
                  {strength}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
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
      className={cn("rounded-lg border bg-card p-5 text-left transition-colors hover:bg-muted", active && "border-primary bg-accent text-accent-foreground")}
    >
      <Icon className="h-5 w-5" />
      <div className="mt-4 font-semibold">{title}</div>
      <p className="mt-2 text-sm leading-6 opacity-75">{text}</p>
    </button>
  );
}

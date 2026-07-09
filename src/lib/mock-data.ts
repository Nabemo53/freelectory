import {
  Bot,
  BriefcaseBusiness,
  Building2,
  Crown,
  Database,
  FileText,
  Gauge,
  Gift,
  Inbox,
  Languages,
  LayoutDashboard,
  Route,
  Send,
  Settings,
  Shield,
  Sparkles,
  Trophy,
  UserRound,
  UsersRound,
  WalletCards,
} from "lucide-react";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/onboarding", label: "AI подбор", icon: Route },
  { href: "/feed", label: "Лента", icon: Inbox },
  { href: "/profile", label: "Профиль", icon: UserRound },
  { href: "/profile/resumes", label: "Резюме", icon: FileText },
  { href: "/crm", label: "CRM", icon: UsersRound },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/admin", label: "Admin", icon: Shield },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const onboardingSteps = [
  { title: "Выбор цели", detail: "Ищу работу или клиентов", status: "done" },
  { title: "Регистрация", detail: "Google, Telegram, Email", status: "done" },
  { title: "Профиль и навыки", detail: "Роль, стек, опыт", status: "done" },
  { title: "Рынок и язык", detail: "СНГ, Global, EN/RU", status: "active" },
  { title: "Лента возможностей", detail: "Лайк = 1 токен", status: "active" },
  { title: "Сохраненные", detail: "На рассмотрении и отклики", status: "next" },
  { title: "Подготовка отклика", detail: "AI письмо, резюме, анализ", status: "next" },
  { title: "CRM", detail: "Статусы и follow-up", status: "next" },
  { title: "Профиль", detail: "Токены, настройки, рефералка", status: "next" },
];

export const stats = [
  { label: "Подходящих карточек", value: "128", trend: "+18 за неделю", icon: Gauge },
  { label: "AI-откликов", value: "42", trend: "74% открытий", icon: Sparkles },
  { label: "В CRM", value: "19", trend: "6 в активных переговорах", icon: BriefcaseBusiness },
  { label: "Токены", value: "3 / 20", trend: "+5 через 3ч 20м", icon: WalletCards },
];

export const opportunities = [
  {
    title: "Frontend Developer",
    company: "hh.ru",
    market: "СНГ / Российский",
    language: "Русский",
    type: "Работа",
    score: 92,
    budget: "180 000 - 220 000 ₽",
    tags: ["React", "TypeScript", "Next.js"],
    summary: "Удаленно, Москва. Разработка интерфейсов и продуктовой команды для B2B-платформы.",
  },
  {
    title: "React Developer",
    company: "FL.ru",
    market: "Global",
    language: "English",
    type: "Клиент",
    score: 88,
    budget: "$4k-$7k",
    tags: ["React", "Tailwind", "API"],
    summary: "Нужен личный кабинет и платежный flow для early-stage SaaS с быстрым запуском.",
  },
  {
    title: "UI/UX Designer",
    company: "Upwork",
    market: "Global",
    language: "English",
    type: "Клиент",
    score: 81,
    budget: "$2k-$3k",
    tags: ["Figma", "Design System", "SaaS"],
    summary: "Клиент ищет продуктового дизайнера для перезапуска onboarding и dashboard.",
  },
];

export const crmItems = [
  { name: "Frontend Developer", stage: "Отправлено", owner: "AI + сайт", value: "12 токенов", next: "Follow-up завтра" },
  { name: "React Developer", stage: "Просмотрено", owner: "Telegram", value: "8 токенов", next: "Уточнить бюджет" },
  { name: "UI/UX Designer", stage: "Получен ответ", owner: "Иван", value: "$2.5k", next: "Discovery call" },
  { name: "Northstar CRM", stage: "Приглашение", owner: "AI scout", value: "$6k", next: "Сгенерировать письмо" },
];

export const tokenActions = [
  ["Лайк вакансии/проекта", "1 токен"],
  ["Генерация отклика", "1 токен"],
  ["Сопроводительное письмо", "1 токен"],
  ["Улучшение резюме", "2 токена"],
  ["Анализ вакансии", "1 токен"],
];

export const leaderboard = [
  { name: "arkadiy.dev", role: "Frontend Developer", points: 1800, wins: 7 },
  { name: "design_hero", role: "Product Designer", points: 1500, wins: 5 },
  { name: "react_master", role: "React Engineer", points: 1200, wins: 4 },
  { name: "ui_ux_king", role: "UX Designer", points: 1100, wins: 4 },
  { name: "code_samurai", role: "Full Stack", points: 1000, wins: 3 },
];

export const adminMetrics = [
  { label: "Users", value: "2 418", icon: UsersRound },
  { label: "Markets", value: "12", icon: Building2 },
  { label: "Languages", value: "9", icon: Languages },
  { label: "Paid seats", value: "186", icon: Crown },
];

export const stackItems = [
  { label: "Frontend", value: "Next.js, TypeScript, Tailwind CSS, shadcn/ui", icon: LayoutDashboard },
  { label: "Backend", value: "Node.js, Serverless Functions, API Gateway", icon: Database },
  { label: "AI", value: "OpenAI / Claude API for scoring and replies", icon: Sparkles },
  { label: "Telegram", value: "Bot API notifications and reply actions", icon: Bot },
  { label: "Tokens", value: "Balance, transactions, refill, limits", icon: WalletCards },
  { label: "Referral", value: "+10 / +5 token incentives", icon: Gift },
  { label: "Applications", value: "Replies, statuses, saved resumes", icon: Send },
  { label: "Security", value: "JWT, 2FA, rate limiting, anti-spam", icon: Shield },
];

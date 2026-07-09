import type { Application, JobOpportunity, Referral, TelegramPhoneVerification, TokenTransaction, UserProfile } from "@/server/types";

type Store = {
  users: UserProfile[];
  jobs: JobOpportunity[];
  likes: { userId: string; jobId: string; liked: boolean; createdAt: string }[];
  applications: Application[];
  transactions: TokenTransaction[];
  referrals: Referral[];
  telegramPhoneVerifications: TelegramPhoneVerification[];
};

const now = () => new Date().toISOString();

function createInitialStore(): Store {
  return {
    users: [
      {
        id: "user_arkadiy",
        email: "arkadiy@example.com",
        telegramId: "demo_telegram",
        phone: "+7 (999) 123-45-67",
        name: "arkadiy.dev",
        title: "Frontend Developer",
        location: "Москва, Россия",
        mode: "job",
        market: "cis",
        language: "ru",
        responseLanguage: "ru",
        skills: ["React", "TypeScript", "Next.js", "JavaScript", "Tailwind CSS", "Git"],
        experienceYears: 3,
        education: "IT / Программная инженерия",
        tokens: 3,
        maxTokens: 20,
        lastRefillAt: now(),
        referralCode: "arkadiy",
      },
    ],
    jobs: [
      {
        id: "job_frontend_hh",
        source: "hh.ru",
        title: "Frontend Developer",
        company: "hh.ru",
        externalId: "hh_180220",
        salary: "180 000 - 220 000 ₽",
        location: "Удаленно, Москва",
        market: "cis",
        language: "ru",
        tags: ["React", "TypeScript", "Next.js"],
        requirements: ["Разработка интерфейсов", "Работа в продуктовой команде", "Английский Intermediate"],
        matchScore: 92,
        type: "vacancy",
        createdAt: now(),
      },
      {
        id: "job_react_fl",
        source: "FL.ru",
        title: "React Developer",
        company: "FL.ru",
        externalId: "fl_react_41",
        salary: "$4k-$7k",
        location: "Remote",
        market: "global",
        language: "en",
        tags: ["React", "Tailwind", "API"],
        requirements: ["Client dashboard", "Payments flow", "Fast MVP launch"],
        matchScore: 88,
        type: "project",
        createdAt: now(),
      },
      {
        id: "job_ux_upwork",
        source: "Upwork",
        title: "UI/UX Designer",
        company: "Upwork",
        externalId: "up_ux_11",
        salary: "$2k-$3k",
        location: "Remote",
        market: "global",
        language: "en",
        tags: ["Figma", "Design System", "SaaS"],
        requirements: ["Onboarding redesign", "Dashboard UX", "Design tokens"],
        matchScore: 81,
        type: "project",
        createdAt: now(),
      },
    ],
    likes: [],
    applications: [
      {
        id: "app_1",
        userId: "user_arkadiy",
        jobId: "job_frontend_hh",
        status: "sent",
        message: "Здравствуйте! Мой опыт с React, TypeScript и Next.js хорошо совпадает с вашей вакансией.",
        resumeId: "resume_frontend",
        createdAt: now(),
        updatedAt: now(),
      },
    ],
    transactions: [
      { id: "tx_seed", userId: "user_arkadiy", amount: 20, reason: "registration_bonus", createdAt: now() },
      { id: "tx_like", userId: "user_arkadiy", amount: -1, reason: "job_like", createdAt: now() },
    ],
    referrals: [],
    telegramPhoneVerifications: [],
  };
}

const globalForStore = globalThis as unknown as { freelectoryStore?: Store };

export const store = globalForStore.freelectoryStore ?? createInitialStore();
globalForStore.freelectoryStore = store;

export const demoUserId = "user_arkadiy";

export function getDemoUser() {
  return store.users.find((user) => user.id === demoUserId) ?? store.users[0];
}

export function spendToken(userId: string, reason: string, amount = 1) {
  const user = store.users.find((candidate) => candidate.id === userId);
  if (!user) {
    throw new Error("User not found");
  }
  if (user.tokens < amount) {
    throw new Error("Not enough tokens");
  }
  user.tokens -= amount;
  const transaction: TokenTransaction = {
    id: `tx_${Date.now()}`,
    userId,
    amount: -amount,
    reason,
    createdAt: now(),
  };
  store.transactions.unshift(transaction);
  return { user, transaction };
}

export function rewardTokens(userId: string, reason: string, amount: number) {
  const user = store.users.find((candidate) => candidate.id === userId);
  if (!user) {
    throw new Error("User not found");
  }
  user.tokens = Math.min(user.maxTokens, user.tokens + amount);
  const transaction: TokenTransaction = {
    id: `tx_${Date.now()}`,
    userId,
    amount,
    reason,
    createdAt: now(),
  };
  store.transactions.unshift(transaction);
  return { user, transaction };
}

export function createTelegramPhoneVerification(userId: string, phone: string) {
  const code = `phone_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
  const createdAt = now();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  const verification: TelegramPhoneVerification = {
    code,
    userId,
    phone,
    status: "pending",
    createdAt,
    expiresAt,
  };

  store.telegramPhoneVerifications.unshift(verification);
  return verification;
}

export function getTelegramPhoneVerification(code: string) {
  const verification = store.telegramPhoneVerifications.find((candidate) => candidate.code === code);
  if (!verification) {
    return null;
  }
  if (verification.status !== "verified" && Date.parse(verification.expiresAt) < Date.now()) {
    verification.status = "expired";
  }
  return verification;
}

export function markTelegramAwaitingContact(code: string, chatId: number, telegramUserId?: number) {
  const verification = getTelegramPhoneVerification(code);
  if (!verification || verification.status === "expired") {
    return null;
  }
  verification.status = "awaiting_contact";
  verification.telegramChatId = chatId;
  verification.telegramUserId = telegramUserId;
  return verification;
}

export function verifyTelegramPhoneByContact(chatId: number, telegramUserId: number | undefined, phone: string) {
  const verification = store.telegramPhoneVerifications.find(
    (candidate) =>
      candidate.telegramChatId === chatId &&
      candidate.status === "awaiting_contact" &&
      Date.parse(candidate.expiresAt) >= Date.now()
  );

  if (!verification) {
    return null;
  }

  verification.status = "verified";
  verification.telegramUserId = telegramUserId ?? verification.telegramUserId;
  verification.verifiedAt = now();
  verification.phone = phone;

  const user = store.users.find((candidate) => candidate.id === verification.userId);
  if (user) {
    user.phone = phone;
    user.phoneVerifiedAt = verification.verifiedAt;
    if (telegramUserId) {
      user.telegramId = String(telegramUserId);
    }
    rewardTokens(user.id, "telegram_phone_verified", 5);
  }

  return { verification, user };
}

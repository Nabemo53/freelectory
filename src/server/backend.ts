import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { demoUserId, getDemoUser, store } from "@/server/mock-store";
import { hasDatabase, prisma } from "@/server/prisma";
import type {
  Application,
  ApplicationStatus,
  JobOpportunity,
  Language,
  Market,
  SearchMode,
  TelegramPhoneVerification,
  TokenTransaction,
  UserProfile,
} from "@/server/types";

type RegisterInput = Partial<UserProfile> & {
  password?: string;
};

type JobFilters = {
  mode?: string | null;
  market?: string | null;
  language?: string | null;
};

const dateToIso = (date: Date | string) => (date instanceof Date ? date.toISOString() : date);

function sourceToDb(source: JobOpportunity["source"]) {
  if (source === "hh.ru") return "hh_ru";
  if (source === "FL.ru") return "fl_ru";
  return "upwork";
}

function sourceFromDb(source: string): JobOpportunity["source"] {
  if (source === "hh_ru") return "hh.ru";
  if (source === "fl_ru") return "FL.ru";
  return "Upwork";
}

function profileFromDb(user: {
  id: string;
  email: string;
  telegramId: string | null;
  phone: string | null;
  phoneVerifiedAt: Date | null;
  name: string;
  title: string;
  location: string;
  mode: string;
  market: string;
  language: string;
  responseLanguage: string;
  skills: string[];
  experienceYears: number;
  education: string;
  tokens: number;
  maxTokens: number;
  lastRefillAt: Date;
  referralCode: string;
}): UserProfile {
  return {
    id: user.id,
    email: user.email,
    telegramId: user.telegramId ?? undefined,
    phone: user.phone ?? undefined,
    phoneVerifiedAt: user.phoneVerifiedAt ? user.phoneVerifiedAt.toISOString() : undefined,
    name: user.name,
    title: user.title,
    location: user.location,
    mode: user.mode as SearchMode,
    market: user.market as Market,
    language: user.language as Language,
    responseLanguage: user.responseLanguage as Language,
    skills: user.skills,
    experienceYears: user.experienceYears,
    education: user.education,
    tokens: user.tokens,
    maxTokens: user.maxTokens,
    lastRefillAt: user.lastRefillAt.toISOString(),
    referralCode: user.referralCode,
  };
}

function jobFromDb(job: {
  id: string;
  source: string;
  title: string;
  company: string;
  externalId: string;
  salary: string;
  location: string;
  market: string;
  language: string;
  tags: string[];
  requirements: string[];
  matchScore: number;
  type: string;
  createdAt: Date;
}): JobOpportunity {
  return {
    id: job.id,
    source: sourceFromDb(job.source),
    title: job.title,
    company: job.company,
    externalId: job.externalId,
    salary: job.salary,
    location: job.location,
    market: job.market as Market,
    language: job.language as Language,
    tags: job.tags,
    requirements: job.requirements,
    matchScore: job.matchScore,
    type: job.type as "vacancy" | "project",
    createdAt: job.createdAt.toISOString(),
  };
}

function applicationFromDb(application: {
  id: string;
  userId: string;
  opportunityId: string;
  status: string;
  message: string;
  resumeId: string | null;
  createdAt: Date;
  updatedAt: Date;
}): Application {
  return {
    id: application.id,
    userId: application.userId,
    jobId: application.opportunityId,
    status: application.status as ApplicationStatus,
    message: application.message,
    resumeId: application.resumeId ?? undefined,
    createdAt: application.createdAt.toISOString(),
    updatedAt: application.updatedAt.toISOString(),
  };
}

function txFromDb(transaction: { id: string; userId: string; amount: number; reason: string; createdAt: Date }): TokenTransaction {
  return {
    id: transaction.id,
    userId: transaction.userId,
    amount: transaction.amount,
    reason: transaction.reason,
    createdAt: transaction.createdAt.toISOString(),
  };
}

function verificationFromDb(verification: {
  code: string;
  userId: string;
  phone: string;
  status: string;
  telegramChatId: bigint | null;
  telegramUserId: bigint | null;
  verifiedAt: Date | null;
  createdAt: Date;
  expiresAt: Date;
}): TelegramPhoneVerification {
  return {
    code: verification.code,
    userId: verification.userId,
    phone: verification.phone,
    status: verification.status as TelegramPhoneVerification["status"],
    telegramChatId: verification.telegramChatId ? Number(verification.telegramChatId) : undefined,
    telegramUserId: verification.telegramUserId ? Number(verification.telegramUserId) : undefined,
    verifiedAt: verification.verifiedAt ? verification.verifiedAt.toISOString() : undefined,
    createdAt: verification.createdAt.toISOString(),
    expiresAt: verification.expiresAt.toISOString(),
  };
}

function buildUserData(input: RegisterInput, passwordHash?: string) {
  const email = String(input.email ?? `user${Date.now()}@example.com`).toLowerCase();
  const referralCode = String(input.referralCode ?? email.split("@")[0]).replace(/[^a-z0-9_-]/gi, "").toLowerCase();

  return {
    email,
    passwordHash,
    telegramId: input.telegramId ? String(input.telegramId) : undefined,
    name: String(input.name ?? "New Freelectory User"),
    title: String(input.title ?? "AI-powered professional"),
    location: String(input.location ?? "Remote"),
    mode: input.mode === "clients" ? "clients" : "job",
    market: input.market === "global" ? "global" : "cis",
    language: input.language === "en" ? "en" : "ru",
    responseLanguage: input.responseLanguage === "en" ? "en" : "ru",
    skills: Array.isArray(input.skills) ? input.skills.map(String) : [],
    experienceYears: Number(input.experienceYears ?? 0),
    education: String(input.education ?? ""),
    tokens: 20,
    maxTokens: 20,
    lastRefillAt: new Date(),
    referralCode: referralCode || `user-${Date.now()}`,
  } satisfies Prisma.UserCreateInput;
}

export async function registerUser(input: RegisterInput) {
  if (!hasDatabase) {
    const email = String(input.email ?? `user${store.users.length + 1}@example.com`);
    const existing = store.users.find((user) => user.email === email);
    if (existing) return { user: existing, created: false };

    const now = new Date().toISOString();
    const user: UserProfile = {
      id: `user_${Date.now()}`,
      email,
      telegramId: input.telegramId ? String(input.telegramId) : undefined,
      name: String(input.name ?? "New Freelectory User"),
      title: String(input.title ?? "AI-powered professional"),
      location: String(input.location ?? "Remote"),
      mode: input.mode === "clients" ? "clients" : "job",
      market: input.market === "global" ? "global" : "cis",
      language: input.language === "en" ? "en" : "ru",
      responseLanguage: input.responseLanguage === "en" ? "en" : "ru",
      skills: Array.isArray(input.skills) ? input.skills.map(String) : [],
      experienceYears: Number(input.experienceYears ?? 0),
      education: String(input.education ?? ""),
      tokens: 20,
      maxTokens: 20,
      lastRefillAt: now,
      referralCode: String(input.referralCode ?? email.split("@")[0]),
    };
    store.users.push(user);
    store.transactions.unshift({ id: `tx_${Date.now()}`, userId: user.id, amount: 20, reason: "registration_bonus", createdAt: now });
    return { user, created: true };
  }

  const passwordHash = input.password ? await bcrypt.hash(input.password, 12) : undefined;
  const data = buildUserData(input, passwordHash);
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) return { user: profileFromDb(existing), created: false };

  const user = await prisma.user.create({
    data: {
      ...data,
      tokenTransactions: { create: { amount: 20, reason: "registration_bonus" } },
    },
  });

  return { user: profileFromDb(user), created: true };
}

export async function loginUser(email: string, password: string) {
  if (!hasDatabase) {
    const user = store.users.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase());
    if (!user) return { user: null, ok: false };
    return { user, ok: true };
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !user.passwordHash) return { user: null, ok: false };

  const ok = await bcrypt.compare(password, user.passwordHash);
  return { user: ok ? profileFromDb(user) : null, ok };
}

export async function getCurrentUser(userId?: string | null) {
  if (!hasDatabase) return userId ? store.users.find((user) => user.id === userId) ?? getDemoUser() : getDemoUser();
  const user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
  return user ? profileFromDb(user) : null;
}

export async function updateCurrentUser(userId: string | undefined, input: Partial<UserProfile>) {
  if (!hasDatabase) {
    const user = userId ? store.users.find((candidate) => candidate.id === userId) ?? getDemoUser() : getDemoUser();
    Object.assign(user, {
      name: input.name ?? user.name,
      title: input.title ?? user.title,
      location: input.location ?? user.location,
      mode: input.mode ?? user.mode,
      market: input.market ?? user.market,
      language: input.language ?? user.language,
      responseLanguage: input.responseLanguage ?? user.responseLanguage,
      skills: Array.isArray(input.skills) ? input.skills.map(String) : user.skills,
      experienceYears: input.experienceYears ?? user.experienceYears,
      education: input.education ?? user.education,
    });
    return user;
  }

  const id = userId ?? (await prisma.user.findFirst({ orderBy: { createdAt: "asc" } }))?.id;
  if (!id) return null;

  const user = await prisma.user.update({
    where: { id },
    data: {
      name: input.name,
      title: input.title,
      location: input.location,
      mode: input.mode,
      market: input.market,
      language: input.language,
      responseLanguage: input.responseLanguage,
      skills: input.skills,
      experienceYears: input.experienceYears,
      education: input.education,
    },
  });

  return profileFromDb(user);
}

export async function listJobs(filters: JobFilters) {
  if (!hasDatabase) {
    const user = getDemoUser();
    return store.jobs
      .filter((job) => (filters.mode === "clients" ? job.type === "project" : filters.mode === "job" ? job.type === "vacancy" : true))
      .filter((job) => (filters.market ? job.market === filters.market : job.market === user.market || job.market === "global"))
      .filter((job) => (filters.language && filters.language !== "auto" ? job.language === filters.language : true))
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  const where: Prisma.OpportunityWhereInput = {};
  if (filters.mode === "clients") where.type = "project";
  if (filters.mode === "job") where.type = "vacancy";
  if (filters.market === "cis" || filters.market === "global") where.market = filters.market;
  if (filters.language === "ru" || filters.language === "en") where.language = filters.language;

  const jobs = await prisma.opportunity.findMany({ where, orderBy: { matchScore: "desc" } });
  return jobs.map(jobFromDb);
}

export async function getJob(jobId: string) {
  if (!hasDatabase) return store.jobs.find((job) => job.id === jobId) ?? null;
  const job = await prisma.opportunity.findUnique({ where: { id: jobId } });
  return job ? jobFromDb(job) : null;
}

export async function spendUserToken(userId: string | undefined, reason: string, amount = 1) {
  if (!hasDatabase) {
    const user = userId ? store.users.find((candidate) => candidate.id === userId) ?? getDemoUser() : getDemoUser();
    if (user.tokens < amount) throw new Error("Not enough tokens");
    user.tokens -= amount;
    const transaction = { id: `tx_${Date.now()}`, userId: user.id, amount: -amount, reason, createdAt: new Date().toISOString() };
    store.transactions.unshift(transaction);
    return { user, transaction };
  }

  const id = userId ?? (await prisma.user.findFirst({ orderBy: { createdAt: "asc" } }))?.id;
  if (!id) throw new Error("User not found");

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id } });
    if (!user) throw new Error("User not found");
    if (user.tokens < amount) throw new Error("Not enough tokens");

    const updated = await tx.user.update({ where: { id }, data: { tokens: { decrement: amount } } });
    const transaction = await tx.tokenTransaction.create({ data: { userId: id, amount: -amount, reason } });
    return { user: profileFromDb(updated), transaction: txFromDb(transaction) };
  });
}

export async function rewardUserTokens(userId: string | undefined, reason: string, amount: number) {
  if (!hasDatabase) {
    const user = userId ? store.users.find((candidate) => candidate.id === userId) ?? getDemoUser() : getDemoUser();
    user.tokens = Math.min(user.maxTokens, user.tokens + amount);
    const transaction = { id: `tx_${Date.now()}`, userId: user.id, amount, reason, createdAt: new Date().toISOString() };
    store.transactions.unshift(transaction);
    return { user, transaction };
  }

  const id = userId ?? (await prisma.user.findFirst({ orderBy: { createdAt: "asc" } }))?.id;
  if (!id) throw new Error("User not found");

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id } });
    if (!user) throw new Error("User not found");
    const updated = await tx.user.update({
      where: { id },
      data: { tokens: Math.min(user.maxTokens, user.tokens + amount) },
    });
    const transaction = await tx.tokenTransaction.create({ data: { userId: id, amount, reason } });
    return { user: profileFromDb(updated), transaction: txFromDb(transaction) };
  });
}

export async function likeJob(userId: string | undefined, jobId: string, liked: boolean) {
  const job = await getJob(jobId);
  if (!job) throw new Error("Job not found");
  const tokenResult = liked ? await spendUserToken(userId, "job_like") : null;

  if (!hasDatabase) {
    const like = { userId: tokenResult?.user.id ?? userId ?? getDemoUser().id, jobId, liked, createdAt: new Date().toISOString() };
    store.likes.unshift(like);
    return { like, job, tokens: tokenResult?.user.tokens };
  }

  const id = userId ?? tokenResult?.user.id;
  if (!id) throw new Error("User not found");
  const like = await prisma.jobLike.upsert({
    where: { userId_opportunityId: { userId: id, opportunityId: jobId } },
    update: { liked },
    create: { userId: id, opportunityId: jobId, liked },
  });

  return {
    like: { userId: like.userId, jobId: like.opportunityId, liked: like.liked, createdAt: like.createdAt.toISOString() },
    job,
    tokens: tokenResult?.user.tokens,
  };
}

export async function createApplication(userId: string | undefined, jobId: string, message: string, status: ApplicationStatus, resumeId?: string) {
  if (!hasDatabase) {
    const now = new Date().toISOString();
    const application = { id: `app_${Date.now()}`, userId: userId ?? getDemoUser().id, jobId, status, message, resumeId, createdAt: now, updatedAt: now };
    store.applications.unshift(application);
    return application;
  }

  const id = userId ?? (await prisma.user.findFirst({ orderBy: { createdAt: "asc" } }))?.id;
  if (!id) throw new Error("User not found");

  const application = await prisma.application.create({
    data: { userId: id, opportunityId: jobId, status, message, resumeId },
  });
  return applicationFromDb(application);
}

export async function listApplications(userId?: string | null) {
  if (!hasDatabase) {
    return store.applications
      .filter((application) => application.userId === (userId ?? demoUserId))
      .map((application) => ({ ...application, job: store.jobs.find((job) => job.id === application.jobId) }));
  }

  const id = userId ?? (await prisma.user.findFirst({ orderBy: { createdAt: "asc" } }))?.id;
  if (!id) return [];
  const items = await prisma.application.findMany({
    where: { userId: id },
    include: { opportunity: true },
    orderBy: { updatedAt: "desc" },
  });
  return items.map((item) => ({ ...applicationFromDb(item), job: jobFromDb(item.opportunity) }));
}

export async function updateApplicationStatus(applicationId: string, status: ApplicationStatus) {
  if (!hasDatabase) {
    const application = store.applications.find((candidate) => candidate.id === applicationId);
    if (!application) return null;
    application.status = status;
    application.updatedAt = new Date().toISOString();
    return application;
  }

  const application = await prisma.application.update({ where: { id: applicationId }, data: { status } });
  return applicationFromDb(application);
}

export async function listTokenTransactions(userId?: string | null) {
  const user = await getCurrentUser(userId);
  if (!user) return { user: null, transactions: [] };
  if (!hasDatabase) return { user, transactions: store.transactions.filter((transaction) => transaction.userId === user.id) };
  const transactions = await prisma.tokenTransaction.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
  return { user, transactions: transactions.map(txFromDb) };
}

export async function listReferrals(userId?: string | null) {
  const user = await getCurrentUser(userId);
  if (!user) return { user: null, referrals: [] };
  if (!hasDatabase) return { user, referrals: store.referrals.filter((referral) => referral.userId === user.id) };
  const referrals = await prisma.referral.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
  return {
    user,
    referrals: referrals.map((referral) => ({ ...referral, createdAt: dateToIso(referral.createdAt) })),
  };
}

export async function createReferral(userId: string | undefined, referredUserId: string) {
  const reward = await rewardUserTokens(userId, "referral_reward", 10);
  if (!hasDatabase) {
    const referral = { id: `ref_${Date.now()}`, userId: reward.user.id, referredUserId, rewardTokens: 10, createdAt: new Date().toISOString() };
    store.referrals.unshift(referral);
    return { referral, balance: reward.user.tokens };
  }

  const referral = await prisma.referral.create({ data: { userId: reward.user.id, referredUserId, rewardTokens: 10 } });
  return { referral: { ...referral, createdAt: referral.createdAt.toISOString() }, balance: reward.user.tokens };
}

export async function createPhoneVerification(userId: string | undefined, phone: string) {
  const code = `phone_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  if (!hasDatabase) {
    const verification: TelegramPhoneVerification = {
      code,
      userId: userId ?? getDemoUser().id,
      phone,
      status: "pending",
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
    };
    store.telegramPhoneVerifications.unshift(verification);
    return verification;
  }

  const id = userId ?? (await prisma.user.findFirst({ orderBy: { createdAt: "asc" } }))?.id;
  if (!id) throw new Error("User not found");
  const verification = await prisma.telegramPhoneVerification.create({ data: { code, userId: id, phone, expiresAt } });
  return verificationFromDb(verification);
}

export async function getPhoneVerification(code: string) {
  if (!hasDatabase) {
    const verification = store.telegramPhoneVerifications.find((candidate) => candidate.code === code);
    if (!verification) return null;
    if (verification.status !== "verified" && Date.parse(verification.expiresAt) < Date.now()) verification.status = "expired";
    return verification;
  }

  const verification = await prisma.telegramPhoneVerification.findUnique({ where: { code } });
  if (!verification) return null;
  if (verification.status !== "verified" && verification.expiresAt.getTime() < Date.now()) {
    const expired = await prisma.telegramPhoneVerification.update({ where: { code }, data: { status: "expired" } });
    return verificationFromDb(expired);
  }
  return verificationFromDb(verification);
}

export async function markPhoneAwaitingContact(code: string, chatId: number, telegramUserId?: number) {
  const verification = await getPhoneVerification(code);
  if (!verification || verification.status === "expired") return null;

  if (!hasDatabase) {
    verification.status = "awaiting_contact";
    verification.telegramChatId = chatId;
    verification.telegramUserId = telegramUserId;
    return verification;
  }

  const updated = await prisma.telegramPhoneVerification.update({
    where: { code },
    data: { status: "awaiting_contact", telegramChatId: chatId, telegramUserId },
  });
  return verificationFromDb(updated);
}

export async function verifyPhoneByTelegramContact(chatId: number, telegramUserId: number | undefined, phone: string) {
  if (!hasDatabase) {
    const verification = store.telegramPhoneVerifications.find(
      (candidate) => candidate.telegramChatId === chatId && candidate.status === "awaiting_contact" && Date.parse(candidate.expiresAt) >= Date.now()
    );
    if (!verification) return null;
    verification.status = "verified";
    verification.telegramUserId = telegramUserId ?? verification.telegramUserId;
    verification.verifiedAt = new Date().toISOString();
    verification.phone = phone;
    const user = store.users.find((candidate) => candidate.id === verification.userId) ?? getDemoUser();
    user.phone = phone;
    user.phoneVerifiedAt = verification.verifiedAt;
    if (telegramUserId) user.telegramId = String(telegramUserId);
    await rewardUserTokens(user.id, "telegram_phone_verified", 5);
    return { verification, user };
  }

  const verification = await prisma.telegramPhoneVerification.findFirst({
    where: { telegramChatId: chatId, status: "awaiting_contact", expiresAt: { gte: new Date() } },
  });
  if (!verification) return null;

  const result = await prisma.$transaction(async (tx) => {
    const updatedVerification = await tx.telegramPhoneVerification.update({
      where: { code: verification.code },
      data: { status: "verified", telegramUserId, verifiedAt: new Date(), phone },
    });
    const currentUser = await tx.user.findUnique({ where: { id: verification.userId } });
    if (!currentUser) throw new Error("User not found");
    const updatedUser = await tx.user.update({
      where: { id: verification.userId },
      data: {
        phone,
        phoneVerifiedAt: new Date(),
        telegramId: telegramUserId ? String(telegramUserId) : undefined,
        tokens: Math.min(currentUser.maxTokens, currentUser.tokens + 5),
        tokenTransactions: { create: { amount: 5, reason: "telegram_phone_verified" } },
      },
    });
    return { verification: verificationFromDb(updatedVerification), user: profileFromDb(updatedUser) };
  });

  return result;
}

export async function seedDatabase() {
  if (!hasDatabase) return { skipped: true, reason: "DATABASE_URL is not configured" };

  const users = await Promise.all(
    store.users.map(async (user) =>
      prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          email: user.email,
          telegramId: user.telegramId,
          phone: user.phone,
          name: user.name,
          title: user.title,
          location: user.location,
          mode: user.mode,
          market: user.market,
          language: user.language,
          responseLanguage: user.responseLanguage,
          skills: user.skills,
          experienceYears: user.experienceYears,
          education: user.education,
          tokens: user.tokens,
          maxTokens: user.maxTokens,
          lastRefillAt: new Date(user.lastRefillAt),
          referralCode: user.referralCode,
        },
      })
    )
  );

  const opportunities = await Promise.all(
    store.jobs.map((job) =>
      prisma.opportunity.upsert({
        where: { externalId: job.externalId },
        update: {},
        create: {
          source: sourceToDb(job.source),
          title: job.title,
          company: job.company,
          externalId: job.externalId,
          salary: job.salary,
          location: job.location,
          market: job.market,
          language: job.language,
          tags: job.tags,
          requirements: job.requirements,
          matchScore: job.matchScore,
          type: job.type,
        },
      })
    )
  );

  return { users: users.length, opportunities: opportunities.length };
}

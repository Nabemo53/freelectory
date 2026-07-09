export type SearchMode = "job" | "clients";
export type Market = "cis" | "global";
export type Language = "ru" | "en" | "auto";

export type UserProfile = {
  id: string;
  email: string;
  telegramId?: string;
  phone?: string;
  phoneVerifiedAt?: string;
  name: string;
  title: string;
  location: string;
  mode: SearchMode;
  market: Market;
  language: Language;
  responseLanguage: Language;
  skills: string[];
  experienceYears: number;
  education: string;
  tokens: number;
  maxTokens: number;
  lastRefillAt: string;
  referralCode: string;
};

export type JobOpportunity = {
  id: string;
  source: "hh.ru" | "FL.ru" | "Upwork";
  title: string;
  company: string;
  externalId: string;
  salary: string;
  location: string;
  market: Market;
  language: Language;
  tags: string[];
  requirements: string[];
  matchScore: number;
  type: "vacancy" | "project";
  createdAt: string;
};

export type ApplicationStatus =
  | "saved"
  | "sent"
  | "viewed"
  | "replied"
  | "invited"
  | "rejected";

export type Application = {
  id: string;
  userId: string;
  jobId: string;
  status: ApplicationStatus;
  message: string;
  resumeId?: string;
  createdAt: string;
  updatedAt: string;
};

export type TokenTransaction = {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  createdAt: string;
};

export type Referral = {
  id: string;
  userId: string;
  referredUserId: string;
  rewardTokens: number;
  createdAt: string;
};

export type TelegramPhoneVerification = {
  code: string;
  userId: string;
  phone: string;
  status: "pending" | "awaiting_contact" | "verified" | "expired";
  telegramChatId?: number;
  telegramUserId?: number;
  verifiedAt?: string;
  createdAt: string;
  expiresAt: string;
};

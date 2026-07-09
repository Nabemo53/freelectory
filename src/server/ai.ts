import type { JobOpportunity, UserProfile } from "@/server/types";

export async function generateApplicationReply({
  profile,
  job,
  tone = "professional",
}: {
  profile: UserProfile;
  job: JobOpportunity;
  tone?: "professional" | "friendly" | "short";
}) {
  if (process.env.OPENAI_API_KEY) {
    // MVP seam: wire real OpenAI generation here when the key is provided.
  }

  const intro =
    tone === "short"
      ? "Здравствуйте!"
      : `Здравствуйте, команда ${job.company}!`;

  return [
    intro,
    `Я ${profile.title} с опытом ${profile.experienceYears}+ года и стеком ${profile.skills.slice(0, 4).join(", ")}.`,
    `Ваша возможность "${job.title}" выглядит сильным матчем: ${job.requirements.slice(0, 2).join(", ")}.`,
    "Готов быстро показать релевантные кейсы и обсудить первый практический шаг.",
  ].join(" ");
}

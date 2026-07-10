import { AppShell } from "@/components/layout/app-shell";
import { OpportunityCard } from "@/components/features/opportunity-card";
import { PageHeading } from "@/components/features/page-heading";

export default function FeedPage() {
  return (
    <AppShell>
      <PageHeading
        title="Reels-лента"
        description="Вертикальная лента карточек: вакансии, проекты и заявки. Выбирайте рынок, платформу, лайк или крест."
      />
      <OpportunityCard />
    </AppShell>
  );
}

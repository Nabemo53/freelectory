import { AppShell } from "@/components/layout/app-shell";
import { OpportunityCard } from "@/components/features/opportunity-card";
import { PageHeading } from "@/components/features/page-heading";

export default function FeedPage() {
  return (
    <AppShell>
      <PageHeading
        title="Лента"
        description="Tinder-механика для вакансий и клиентских заявок: лайк, пропуск, AI-отклик и CRM."
      />
      <OpportunityCard />
    </AppShell>
  );
}

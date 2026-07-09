import { AppShell } from "@/components/layout/app-shell";
import { CrmTable } from "@/components/features/crm-table";
import { OpportunityCard } from "@/components/features/opportunity-card";
import { PageHeading } from "@/components/features/page-heading";
import { StatGrid } from "@/components/features/stat-grid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <AppShell>
      <PageHeading
        title="Dashboard"
        description="Рабочий центр Freelectory: цель, рынок, язык, лента, отклики, CRM и токены."
      />
      <div className="mb-6 flex flex-wrap gap-2">
        <Button>Ищу работу</Button>
        <Button variant="outline">Ищу клиентов</Button>
      </div>
      <StatGrid />
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <OpportunityCard />
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Token wallet</CardTitle>
              <CardDescription>Баланс, лимиты и списания за AI-действия.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-semibold">3 / 20</div>
              <div className="mt-4 h-2 rounded-full bg-secondary">
                <div className="h-2 w-[15%] rounded-full bg-primary" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">+5 токенов через 3ч 20м.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>AI assistant</CardTitle>
              <CardDescription>Сегодня стоит отправить 6 откликов и 3 follow-up.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {["Переписать intro под hh.ru", "Подготовить Telegram summary", "Улучшить resume_frontend.pdf"].map((task) => (
                <div key={task} className="rounded-md border p-3 text-sm">{task}</div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-6">
        <CrmTable />
      </div>
    </AppShell>
  );
}

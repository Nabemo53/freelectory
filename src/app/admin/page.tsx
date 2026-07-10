import { AppShell } from "@/components/layout/app-shell";
import { PageHeading } from "@/components/features/page-heading";
import { adminMetrics } from "@/lib/mock-data";
import { getSession } from "@/server/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminPage() {
  const session = await getSession();
  const admins = (process.env.ADMIN_EMAILS ?? "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  const isAdmin = Boolean(session?.email && admins.includes(session.email.toLowerCase()));

  if (!isAdmin) {
    return (
      <AppShell>
        <PageHeading title="Нет доступа" description="Админ-панель доступна только владельцу проекта. Добавьте email в ADMIN_EMAILS на Vercel." />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeading title="Admin" description="Операционная панель для рынков, пользователей, токенов, интеграций и модерации." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {adminMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label}>
              <CardContent className="p-4">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <div className="mt-4 text-2xl font-semibold">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Moderation queue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {["Проверить новую площадку заявок", "Обновить лимиты бесплатного тарифа", "Промодерировать 18 Telegram events"].map((item) => (
            <div key={item} className="rounded-md border p-3 text-sm">{item}</div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}

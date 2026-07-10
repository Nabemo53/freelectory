import { AppShell } from "@/components/layout/app-shell";
import { PageHeading } from "@/components/features/page-heading";
import { TelegramPhoneCard } from "@/components/features/telegram-phone-card";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

export default function SettingsPage() {
  return (
    <AppShell>
      <PageHeading title="Настройки" description="Рынок, язык, Telegram-бот, тема и лимиты токенов." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Workspace</CardTitle>
            <CardDescription>Эти настройки используются для фильтров ленты и AI-подбора.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select defaultValue="cis">
              <option value="cis">СНГ / русский рынок</option>
              <option value="global">Западный / Global</option>
            </Select>
            <Select defaultValue="ru">
              <option value="ru">Русский</option>
              <option value="en">English</option>
              <option value="auto">Автоматически</option>
            </Select>
            <Button>Сохранить настройки</Button>
          </CardContent>
        </Card>

        <TelegramPhoneCard />

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Тема сохраняется в localStorage и применяется ко всему приложению.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <div className="font-medium">Светлая / тёмная тема</div>
              <div className="text-sm text-muted-foreground">Переключатель доступен также в верхней панели.</div>
            </div>
            <ThemeToggle />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

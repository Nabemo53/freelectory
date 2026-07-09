import { AppShell } from "@/components/layout/app-shell";
import { PageHeading } from "@/components/features/page-heading";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

export default function SettingsPage() {
  return (
    <AppShell>
      <PageHeading title="Settings" description="Настройки рынка, языка, Telegram-бота, темы и лимитов токенов." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Workspace</CardTitle>
            <CardDescription>Настройки будут использоваться для будущего backend и AI scoring.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select defaultValue="cis">
              <option value="cis">СНГ / Российский</option>
              <option value="global">Американский / Global</option>
            </Select>
            <Select defaultValue="ru">
              <option value="ru">Русский</option>
              <option value="en">English</option>
              <option value="auto">Автоматически</option>
            </Select>
            <Button>Сохранить настройки</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Тема сохраняется в localStorage и применяется ко всему приложению.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <div className="font-medium">Светлая / темная тема</div>
              <div className="text-sm text-muted-foreground">Переключатель доступен также в верхней панели.</div>
            </div>
            <ThemeToggle />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

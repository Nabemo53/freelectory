import { AppShell } from "@/components/layout/app-shell";
import { PageHeading } from "@/components/features/page-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export default function ProfilePage() {
  return (
    <AppShell>
      <PageHeading title="Профиль" description="Данные, по которым AI подбирает вакансии, проекты и генерирует персональные отклики." />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Профиль и навыки</CardTitle>
            <CardDescription>Mock-форма без backend, готовая к будущему сохранению.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Input defaultValue="arkadiy.dev" />
            <Input defaultValue="Frontend Developer" />
            <Select defaultValue="job">
              <option value="job">Ищу работу</option>
              <option value="clients">Ищу клиентов</option>
            </Select>
            <Select defaultValue="cis">
              <option value="cis">СНГ / Российский</option>
              <option value="global">Американский / Global</option>
            </Select>
            <Input className="md:col-span-2" defaultValue="React, TypeScript, Next.js, JavaScript, Tailwind CSS, Git" />
            <Input defaultValue="3 года" />
            <Input defaultValue="IT / Программная инженерия" />
            <Button className="md:w-fit">Сохранить профиль</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Profile score</CardTitle>
            <CardDescription>Чем выше полнота, тем точнее matching.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-semibold">86%</div>
            <div className="mt-5 h-2 rounded-full bg-secondary">
              <div className="h-2 w-[86%] rounded-full bg-primary" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Добавьте зарплатные ожидания и 2 кейса для лучшего скоринга.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

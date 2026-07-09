import { AppShell } from "@/components/layout/app-shell";
import { PageHeading } from "@/components/features/page-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResumesPage() {
  const resumes = ["resume_frontend.pdf", "resume_ai_saas.pdf", "resume_freelance_mvp.pdf"];

  return (
    <AppShell>
      <PageHeading title="Резюме" description="Версии резюме под рынки, языки и разные типы возможностей." />
      <div className="grid gap-4 md:grid-cols-3">
        {resumes.map((resume, index) => (
          <Card key={resume}>
            <CardHeader>
              <CardTitle>{resume}</CardTitle>
              <CardDescription>{index === 0 ? "Основное" : "Адаптированное"} · обновлено 03.05.2026</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">AI может улучшить summary, bullets и сопроводительное письмо под выбранную карточку.</p>
              <Button className="mt-4 w-full" variant={index === 0 ? "default" : "outline"}>Редактировать</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

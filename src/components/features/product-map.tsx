import { onboardingSteps, stackItems, tokenActions } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductMap() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-14 lg:px-6">
      <div className="grid gap-4 lg:grid-cols-9">
        {onboardingSteps.map((step, index) => (
          <Card key={step.title} className={step.status === "active" ? "border-primary" : ""}>
            <CardContent className="p-4">
              <div className="text-xs font-semibold text-muted-foreground">{index + 1}.</div>
              <div className="mt-2 text-sm font-semibold">{step.title}</div>
              <div className="mt-2 text-xs leading-5 text-muted-foreground">{step.detail}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Backend архитектура</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {["API Gateway", "Auth Service", "User Service", "Matching Service", "Job Service", "AI Service", "Resume Service", "Token Service"].map((item) => (
                <div key={item} className="rounded-md border bg-muted/40 p-3 text-sm font-medium">
                  {item}
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">REST API · Serverless · queues</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg border bg-muted/30 p-4">
              <div className="text-sm font-semibold">Supabase PostgreSQL</div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                users, profiles, resumes, jobs, job_likes, applications, tokens, referrals, notifications.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Экономика токенов</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md border p-3">
              <div className="text-sm font-semibold">Бесплатный тариф</div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">20 токенов при регистрации, максимум 20, +5 каждые 5 часов.</p>
            </div>
            <div className="rounded-md border border-primary/30 bg-accent p-3 text-accent-foreground">
              <div className="text-sm font-semibold">Pro тариф</div>
              <p className="mt-2 text-xs leading-5">100 токенов при подключении, максимум 100, приоритетная обработка.</p>
            </div>
            {tokenActions.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 border-b pb-2 text-sm last:border-0">
                <span>{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Рефералка и рейтинг</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border bg-muted/30 p-3 text-center">
                <div className="text-lg font-semibold text-destructive">+10</div>
                <div className="text-xs text-muted-foreground">за приглашенного</div>
              </div>
              <div className="rounded-md border bg-muted/30 p-3 text-center">
                <div className="text-lg font-semibold text-destructive">+5</div>
                <div className="text-xs text-muted-foreground">друг получает</div>
              </div>
            </div>
            <div className="mt-4 rounded-md border p-3 text-sm">jobai.app/ref/arkadiy</div>
            <div className="mt-4 space-y-2">
              {["arkadiy.dev · 1800", "design_hero · 1500", "react_master · 1200"].map((item) => (
                <div key={item} className="rounded-md bg-secondary px-3 py-2 text-sm">{item}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stackItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label}>
              <CardContent className="p-4">
                <Icon className="h-4 w-4 text-primary" />
                <div className="mt-3 text-sm font-semibold">{item.label}</div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

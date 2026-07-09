import { AppShell } from "@/components/layout/app-shell";
import { PageHeading } from "@/components/features/page-heading";
import { leaderboard } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";

export default function LeaderboardPage() {
  return (
    <AppShell>
      <PageHeading title="Leaderboard" description="Рейтинг пользователей по активности, откликам, ответам и приглашенным людям." />
      <Card>
        <CardContent className="p-0">
          {leaderboard.map((user, index) => (
            <div key={user.name} className="flex items-center justify-between gap-4 border-b p-5 last:border-0">
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-sm font-semibold">{index + 1}</div>
                <div>
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.role}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{user.points.toLocaleString("ru-RU")} pts</div>
                <div className="text-sm text-muted-foreground">{user.wins} приглашений</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}

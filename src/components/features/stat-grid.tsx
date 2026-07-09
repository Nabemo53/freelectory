import { stats } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";

export function StatGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-normal">{stat.value}</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{stat.trend}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { opportunities } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const savedKey = "freelectory_saved_cards";

export function SavedProfileCards() {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    setSavedIds(JSON.parse(localStorage.getItem(savedKey) || "[]") as string[]);
  }, []);

  const saved = opportunities.filter((item) => savedIds.includes(item.id));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Сохранённые лайки</CardTitle>
        <CardDescription>Карточки, которые вы лайкнули в reels-ленте. В backend MVP лайк также списывает 1 токен.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {saved.map((item) => (
          <div key={item.id} className="flex items-center gap-2 rounded-md border p-3 text-sm">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <div>
              <div className="font-medium">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.platform} · {item.budget}</div>
            </div>
          </div>
        ))}
        {!saved.length && <p className="text-sm text-muted-foreground">Пока нет сохранённых лайков.</p>}
      </CardContent>
    </Card>
  );
}

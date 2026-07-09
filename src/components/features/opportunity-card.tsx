"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Heart, Info, Send, Sparkles, X } from "lucide-react";
import { opportunities } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function OpportunityCard() {
  const [index, setIndex] = useState(0);
  const current = opportunities[index % opportunities.length];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Лента возможностей</CardTitle>
            <CardDescription>Свайпайте вакансии и проекты. Один лайк списывает 1 токен.</CardDescription>
          </div>
          <div className="rounded-md bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground">
            {current.score}% match
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="rounded-xl border bg-[#17202b] p-5 text-white shadow-sm dark:bg-[#18202c]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">{current.company}</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-normal">{current.title}</h3>
              <p className="mt-2 text-sm text-slate-300">
                {current.market} · {current.language}
              </p>
            </div>
            <div className="rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold">{current.budget}</div>
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-200">{current.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {current.tags.map((tag) => (
              <span key={tag} className="rounded-md border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button className="hidden sm:inline-flex" variant="outline" size="icon" onClick={() => setIndex((index + opportunities.length - 1) % opportunities.length)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:justify-center">
            <Button variant="outline">
              <X className="h-4 w-4" />
              Пропустить
            </Button>
            <Button variant="outline">
              <Info className="h-4 w-4" />
              Детали
            </Button>
            <Button onClick={() => setIndex((index + 1) % opportunities.length)}>
              <Heart className="h-4 w-4" />
              Лайк
            </Button>
          </div>
          <Button className="hidden sm:inline-flex" variant="outline" size="icon" onClick={() => setIndex((index + 1) % opportunities.length)}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4 rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Send className="h-4 w-4" />
            Черновик AI-отклика
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Привет! Я внимательно посмотрел задачу {current.company}: мой опыт с {current.tags[0]} и продуктовой разработкой
            хорошо совпадает с требованиями. Могу быстро показать релевантные кейсы и предложить план первого спринта.
          </p>
          <Button className="mt-4" variant="secondary">
            <Sparkles className="h-4 w-4" />
            Улучшить отклик
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

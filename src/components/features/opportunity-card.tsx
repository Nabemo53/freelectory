"use client";

import { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, Check, ChevronDown, ExternalLink, Globe2, Heart, RotateCcw, Sparkles, X, Zap } from "lucide-react";
import { opportunities } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

type Decision = "liked" | "skipped";
type LikeResponse = { tokens?: number; spent?: number; error?: string };

const savedKey = "freelectory_saved_cards";

export function OpportunityCard() {
  const [market, setMarket] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [tokens, setTokens] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data) => setTokens(data.user?.tokens ?? 20))
      .catch(() => setTokens(20));
  }, []);

  const filtered = useMemo(() => {
    return opportunities.filter((item) => {
      const marketOk = market === "all" || item.marketType === market;
      const platformOk = platform === "all" || item.platformId === platform;
      return marketOk && platformOk;
    });
  }, [market, platform]);

  const deck = filtered.filter((item) => !decisions[item.id]);
  const current = deck[0];
  const likedCards = opportunities.filter((item) => decisions[item.id] === "liked");
  const skipped = Object.values(decisions).filter((item) => item === "skipped").length;

  const saveLikedCard = (id: string) => {
    const previous = JSON.parse(localStorage.getItem(savedKey) || "[]") as string[];
    const next = Array.from(new Set([...previous, id]));
    localStorage.setItem(savedKey, JSON.stringify(next));
  };

  const decide = async (decision: Decision) => {
    if (!current) return;
    setError("");

    if (decision === "liked") {
      const response = await fetch("/api/jobs/like", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jobId: current.id, liked: true }),
      });
      const data = (await response.json()) as LikeResponse;
      if (!response.ok) {
        setError(data.error ?? "Не удалось поставить лайк");
        return;
      }
      if (typeof data.tokens === "number") setTokens(data.tokens);
      saveLikedCard(current.id);
    }

    setDecisions((items) => ({ ...items, [current.id]: decision }));
  };

  const reset = () => {
    setDecisions({});
    setError("");
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
      <section className="min-h-[calc(100vh-180px)] snap-y snap-mandatory overflow-y-auto rounded-lg border bg-muted/20 p-3">
        <div className="sticky top-0 z-10 mb-3 grid gap-3 rounded-lg border bg-background/95 p-3 backdrop-blur md:grid-cols-[1fr_1fr_auto_auto]">
          <Select value={market} onChange={(event) => { setMarket(event.target.value); setDecisions({}); }}>
            <option value="all">Все рынки</option>
            <option value="cis">СНГ</option>
            <option value="global">Западный / Global</option>
          </Select>
          <Select value={platform} onChange={(event) => { setPlatform(event.target.value); setDecisions({}); }}>
            <option value="all">Все платформы</option>
            <option value="hh">hh.ru</option>
            <option value="habr">Хабр Карьера</option>
            <option value="fl">FL.ru</option>
            <option value="kwork">Kwork</option>
            <option value="upwork">Upwork API-бот</option>
            <option value="linkedin">LinkedIn</option>
            <option value="telegram">Telegram</option>
          </Select>
          <div className="flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-semibold">
            <Zap className="h-4 w-4 text-warning" />
            {tokens ?? "..."} токенов
          </div>
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
            Сбросить
          </Button>
        </div>

        {error && <p className="mb-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

        {!current && (
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              Карточки закончились для текущих фильтров. Сбросьте решения или смените рынок/площадку.
            </CardContent>
          </Card>
        )}

        {current && (
          <article className="mx-auto flex min-h-[calc(100vh-280px)] max-w-xl snap-start flex-col justify-center py-4">
            <div className="overflow-hidden rounded-2xl border bg-[#121821] text-white shadow-sm">
              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                  <Globe2 className="h-4 w-4" />
                  {current.platform}
                </div>
                <div className="rounded-md border border-white/15 bg-white/10 px-2 py-1 text-xs">{current.score}% match</div>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-slate-300">{current.type} · {current.market}</div>
                    <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal">{current.title}</h2>
                    <p className="mt-2 text-sm text-slate-300">{current.company}</p>
                  </div>
                  <div className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-950">{current.budget}</div>
                </div>
                <p className="mt-6 text-base leading-7 text-slate-100">{current.summary}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {current.tags.map((tag) => (
                    <span key={tag} className="rounded-md border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-medium">{tag}</span>
                  ))}
                </div>
                <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Sparkles className="h-4 w-4" />
                    AI-фильтры
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{current.filters.join(", ")}</p>
                </div>
                <a href={current.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white underline-offset-4 hover:underline">
                  Ссылка на работу <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <div className="grid grid-cols-2 border-t border-white/10">
                <button onClick={() => decide("skipped")} className="flex h-16 items-center justify-center gap-2 text-sm font-semibold text-slate-200 hover:bg-white/10">
                  <X className="h-5 w-5" />
                  Крест
                </button>
                <button onClick={() => decide("liked")} disabled={tokens === 0} className="flex h-16 items-center justify-center gap-2 bg-primary text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50">
                  <Heart className="h-5 w-5" />
                  Лайк (-1 токен)
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ChevronDown className="h-4 w-4" />
              Reels-лента: одна карточка, одно решение, лайк списывает токен
            </div>
          </article>
        )}
      </section>

      <aside className="space-y-4">
        <Card>
          <CardContent className="p-5">
            <div className="text-sm font-semibold">Статус ленты</div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Metric label="Лайки" value={likedCards.length} />
              <Metric label="Кресты" value={skipped} />
            </div>
            <div className="mt-4 rounded-lg border bg-muted/30 p-3 text-sm leading-6 text-muted-foreground">
              Telegram бот может анализировать только те каналы/чаты, куда он добавлен или откуда вы пересылаете заявки. Avito нельзя честно анализировать без официального API/доступа или разрешённого парсинга.
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <BriefcaseBusiness className="h-4 w-4" />
              Сохранено в профиль
            </div>
            <div className="mt-4 space-y-2">
              {likedCards.map((item) => (
                <div key={item.id} className="flex items-center gap-2 rounded-md border p-2 text-sm">
                  <Check className="h-4 w-4 text-success" />
                  {item.title}
                </div>
              ))}
              {!likedCards.length && <p className="text-sm text-muted-foreground">Пока нет лайков.</p>}
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Bot, ChevronDown, Menu, Search, Zap } from "lucide-react";
import { navItems } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="shell-grid grid min-h-screen">
        <aside className="hidden border-r bg-muted/40 lg:block">
          <div className="sticky top-0 flex h-screen flex-col">
            <Link href="/" className="flex h-16 items-center gap-3 border-b px-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">Freelectory</div>
                <div className="text-xs text-muted-foreground">AI work scout</div>
              </div>
            </Link>

            <nav className="flex-1 space-y-1 px-3 py-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex h-9 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                      isActive && "bg-secondary text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t p-4">
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Bot className="h-4 w-4" />
                  Telegram bot
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  14 новых карточек и 3 follow-up готовы к отправке.
                </p>
                <Button className="mt-3 w-full" size="sm" variant="secondary">
                  Открыть inbox
                </Button>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur-sm lg:px-6">
            <Button variant="outline" size="icon" className="lg:hidden" aria-label="Открыть меню">
              <Menu className="h-4 w-4" />
            </Button>
            <div className="relative hidden flex-1 md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="max-w-xl pl-9" placeholder="Поиск вакансий, клиентов, компаний..." />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Select defaultValue="cis" className="hidden md:block">
                <option value="cis">СНГ / Российский</option>
                <option value="us">US Remote</option>
                <option value="eu">Europe</option>
              </Select>
              <LanguageToggle />
              <div className="hidden h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium md:flex">
                <Zap className="h-4 w-4 text-warning" />
                3 / 20
              </div>
              <ThemeToggle />
              <Button variant="outline" size="icon" aria-label="Уведомления" className="hidden sm:inline-flex">
                <Bell className="h-4 w-4" />
              </Button>
              <button className="hidden h-9 items-center gap-2 rounded-md border px-2 text-sm font-medium sm:flex">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">AD</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </header>
          <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

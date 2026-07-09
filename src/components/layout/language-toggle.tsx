"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex h-9 items-center rounded-md border bg-background p-1">
      <Button
        type="button"
        size="sm"
        variant={language === "ru" ? "default" : "ghost"}
        className="h-7 px-2 text-xs"
        onClick={() => setLanguage("ru")}
        aria-label="Русский язык"
      >
        RU
      </Button>
      <Button
        type="button"
        size="sm"
        variant={language === "en" ? "default" : "ghost"}
        className="h-7 px-2 text-xs"
        onClick={() => setLanguage("en")}
        aria-label="English language"
      >
        EN
      </Button>
      <Languages className="ml-1 mr-1 hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
    </div>
  );
}

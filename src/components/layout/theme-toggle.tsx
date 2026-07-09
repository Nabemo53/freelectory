"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Переключить тему" title="Переключить тему">
      <Icon className="h-4 w-4" />
    </Button>
  );
}

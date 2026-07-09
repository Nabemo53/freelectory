"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("freelectory-theme") as Theme | null;
    const next = stored === "dark" || stored === "light" ? stored : "light";
    setThemeState(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }, []);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    window.localStorage.setItem("freelectory-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}

"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AppLanguage = "ru" | "en";

const LanguageContext = createContext<{
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  toggleLanguage: () => void;
} | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>("ru");

  useEffect(() => {
    const stored = window.localStorage.getItem("freelectory-language") as AppLanguage | null;
    const next = stored === "en" || stored === "ru" ? stored : "ru";
    setLanguageState(next);
    document.documentElement.lang = next;
  }, []);

  const setLanguage = (next: AppLanguage) => {
    setLanguageState(next);
    window.localStorage.setItem("freelectory-language", next);
    document.documentElement.lang = next;
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => setLanguage(language === "ru" ? "en" : "ru"),
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}

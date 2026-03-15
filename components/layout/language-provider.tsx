"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Language = "id" | "en";

type LanguageContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("id");

  useEffect(() => {
    const stored = window.localStorage.getItem("site_lang");
    if (stored === "id" || stored === "en") {
      setLangState(stored);
      return;
    }
    const cookieMatch = document.cookie.match(/(?:^|; )site_lang=([^;]+)/);
    const cookieLang = cookieMatch?.[1];
    if (cookieLang === "id" || cookieLang === "en") {
      setLangState(cookieLang);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("site_lang", lang);
    document.cookie = `site_lang=${lang}; path=/; max-age=31536000`;
    document.documentElement.lang = lang === "id" ? "id" : "en";
  }, [lang]);

  const setLang = (next: Language) => setLangState(next);
  const toggleLang = () => setLangState((prev) => (prev === "id" ? "en" : "id"));

  const value = useMemo(() => ({ lang, setLang, toggleLang }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}

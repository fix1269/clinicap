import { useEffect, useState, useCallback } from "react";

export type Lang = "ar" | "en";
const KEY = "clinic-lang";

function getInitial(): Lang {
  if (typeof window === "undefined") return "ar";
  const saved = localStorage.getItem(KEY);
  return saved === "en" ? "en" : "ar";
}

export function useLang() {
  const [lang, setLangState] = useState<Lang>(getInitial);

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    document.body.style.fontFamily =
      lang === "ar"
        ? "'Cairo', system-ui, -apple-system, sans-serif"
        : "'Inter', system-ui, -apple-system, sans-serif";
    localStorage.setItem(KEY, lang);
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleLang = useCallback(() => setLangState((l) => (l === "ar" ? "en" : "ar")), []);
  return { lang, setLang, toggleLang };
}

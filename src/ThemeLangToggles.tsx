import { Sun, Moon, Languages } from "lucide-react";
import type { Theme } from "./useTheme";
import type { Lang } from "./useLang";
import { tr } from "./i18n";

interface Props {
  theme: Theme;
  onToggleTheme: () => void;
  lang: Lang;
  onToggleLang: () => void;
  variant?: "patient" | "admin";
}

export default function ThemeLangToggles({ theme, onToggleTheme, lang, onToggleLang, variant = "patient" }: Props) {
  const isPatient = variant === "patient";
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onToggleLang}
        aria-label={lang === "ar" ? "Switch to English" : "تبديل للعربية"}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
          isPatient
            ? "bg-white/15 text-white ring-1 ring-white/25 backdrop-blur hover:bg-white/25"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        }`}
      >
        <Languages className="h-3.5 w-3.5" strokeWidth={2.4} />
        {lang === "ar" ? "EN" : "ع"}
      </button>
      <button
        type="button"
        onClick={onToggleTheme}
        aria-label={theme === "dark" ? tr("lightMode", lang) : tr("darkMode", lang)}
        className={`inline-flex items-center justify-center rounded-full p-2 transition active:scale-95 ${
          isPatient
            ? "bg-white/15 text-white ring-1 ring-white/25 backdrop-blur hover:bg-white/25"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        }`}
      >
        {theme === "dark" ? <Sun className="h-4 w-4" strokeWidth={2.2} /> : <Moon className="h-4 w-4" strokeWidth={2.2} />}
      </button>
    </div>
  );
}

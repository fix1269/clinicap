import { useEffect, useState } from "react";
import { Tag, Clock, CheckCircle2, Sparkles } from "lucide-react";
import type { Package } from "./marketing";
import type { Lang } from "./useLang";
import { tr } from "./i18n";

interface Props {
  packages: Package[];
  lang: Lang;
}

function useCountdown(hours: number) {
  const [deadline] = useState(() => Date.now() + hours * 3600 * 1000);
  const [remaining, setRemaining] = useState(deadline - Date.now());
  useEffect(() => {
    const id = setInterval(() => setRemaining(deadline - Date.now()), 1000);
    return () => clearInterval(id);
  }, [deadline]);
  return Math.max(0, remaining);
}

function fmt(ms: number): { h: string; m: string; s: string } {
  const total = Math.floor(ms / 1000);
  return {
    h: String(Math.floor(total / 3600)).padStart(2, "0"),
    m: String(Math.floor((total % 3600) / 60)).padStart(2, "0"),
    s: String(total % 60).padStart(2, "0"),
  };
}

export default function PackagesOffers({ packages, lang }: Props) {
  const active = packages.filter((p) => p.active);
  const remaining = useCountdown(24);
  const time = fmt(remaining);

  if (active.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("packages", lang)}</h2>
      </div>

      <div className="mb-5 overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 p-4 text-center text-white shadow-lg">
        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wide">
          <Clock className="h-4 w-4" /> {tr("offersEndIn", lang)}
        </div>
        <div className="mt-2 flex items-center justify-center gap-2 text-2xl font-extrabold tabular-nums" dir="ltr">
          <span className="rounded-lg bg-white/20 px-3 py-1 backdrop-blur">{time.h}</span>:
          <span className="rounded-lg bg-white/20 px-3 py-1 backdrop-blur">{time.m}</span>:
          <span className="rounded-lg bg-white/20 px-3 py-1 backdrop-blur">{time.s}</span>
        </div>
      </div>

      <div className="space-y-4">
        {active.map((pkg) => {
          const finalPrice = pkg.price && pkg.discount
            ? Math.round(Number(pkg.price) * (1 - Number(pkg.discount) / 100))
            : pkg.price;
          return (
            <div key={pkg.id} className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-md transition-all duration-300 hover:shadow-lg dark:border-amber-800/40 dark:bg-slate-800">
              <div className="flex items-center justify-between bg-gradient-to-r from-amber-400 to-orange-400 px-4 py-2.5">
                <div className="flex items-center gap-2 text-white">
                  <Tag className="h-4 w-4" />
                  <span className="text-sm font-extrabold" style={{ fontFamily: "'Cairo', sans-serif" }}>{pkg.name}</span>
                </div>
                {pkg.discount && (
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-extrabold text-rose-600 shadow">
                    -{pkg.discount}%
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="mb-3 flex items-end gap-2">
                  {pkg.price && (
                    <>
                      <span className="text-2xl font-extrabold text-teal-700 dark:text-teal-400" dir="ltr">
                        {pkg.discount ? finalPrice : pkg.price}
                      </span>
                      <span className="text-sm font-bold text-slate-400 dark:text-slate-500" style={{ fontFamily: "'Cairo', sans-serif" }}>ج.م</span>
                      {pkg.discount && (
                        <span className="ml-1 text-sm font-bold text-slate-400 line-through" dir="ltr">{pkg.price}</span>
                      )}
                    </>
                  )}
                </div>
                {pkg.services && (
                  <div className="space-y-1.5">
                    {pkg.services.split("\n").filter(Boolean).map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        <span style={{ fontFamily: "'Cairo', sans-serif" }}>{s.trim()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

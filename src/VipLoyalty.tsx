import { useState } from "react";
import { Crown, Sparkles, Gift, Copy, Check } from "lucide-react";
import type { VipSettings } from "./marketing";
import { generateVipCode } from "./marketing";
import type { Lang } from "./useLang";
import { tr } from "./i18n";
import { clinicConfig } from "./firebase-config";

interface Props {
  vip: VipSettings;
  lang: Lang;
}

export default function VipLoyalty({ vip, lang }: Props) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const discount = vip.discountPercent || "10";

  function generate() {
    if (!name) return;
    setCode(generateVipCode());
    setGenerated(true);
  }

  function copyCode() {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center gap-2">
        <Crown className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("vipCard", lang)}</h2>
      </div>

      {!generated ? (
        <div className="overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-5 text-center shadow-md dark:border-amber-800/40 dark:from-amber-900/20 dark:to-yellow-900/20">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg">
            <Gift className="h-8 w-8 text-white" />
          </div>
          <p className="mb-1 text-sm font-bold text-amber-800 dark:text-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
            {lang === "ar" ? `احصل على خصم ${discount}% على زياراتك القادمة` : `Get ${discount}% off your next visits`}
          </p>
          <p className="mb-4 text-xs text-amber-600 dark:text-amber-400" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("validAt", lang)}</p>
          <input value={name} onChange={(e) => setName(e.target.value)}
            placeholder={tr("enterName", lang)}
            className="mb-3 w-full rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-center text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
            style={{ fontFamily: "'Cairo', sans-serif" }} />
          <button type="button" onClick={generate} disabled={!name}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 py-3 text-sm font-extrabold text-white shadow-lg transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
            style={{ fontFamily: "'Cairo', sans-serif" }}>
            <Sparkles className="h-4 w-4" /> {tr("generateCard", lang)}
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl shadow-xl">
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 p-5 text-white">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-500/20 blur-2xl" />
            <div className="absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-yellow-500/10 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-400" />
                  <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">VIP</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400" style={{ fontFamily: "'Cairo', sans-serif" }}>{clinicConfig.doctorName}</span>
              </div>
              <p className="mb-1 text-[10px] uppercase tracking-wide text-slate-400" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("issuedFor", lang)}</p>
              <p className="mb-4 text-lg font-extrabold" style={{ fontFamily: "'Cairo', sans-serif" }}>{name}</p>
              <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
                <p className="text-[10px] uppercase tracking-wide text-slate-400" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("yourCode", lang)}</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-base font-extrabold tracking-wider text-amber-400" dir="ltr">{code}</span>
                  <button type="button" onClick={copyCode} className="rounded-lg bg-amber-500/20 p-1.5 text-amber-300 transition hover:bg-amber-500/30">
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-lg bg-amber-500/15 px-3 py-2">
                <span className="text-xs font-bold text-amber-300" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("discountPercent", lang)}</span>
                <span className="text-xl font-extrabold text-amber-400" dir="ltr">{discount}%</span>
              </div>
              <p className="mt-3 text-center text-[9px] text-slate-500" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("validAt", lang)}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

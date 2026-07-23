import { useMemo } from "react";
import { CalendarClock, MessageCircle, BellRing } from "lucide-react";
import type { Patient, Visit } from "./types";
import type { Lang } from "./useLang";
import { tr } from "./i18n";
import { whatsappShareUrl } from "./marketing";
import { formatDateAr } from "./egyptTime";

interface Props {
  patients: Patient[];
  lang: Lang;
}

interface FollowupRow {
  patient: Patient;
  visit: Visit;
  daysUntil: number;
}

function dateDiffDays(dateStr: string): number {
  if (!dateStr) return Infinity;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export default function FollowupTracker({ patients, lang }: Props) {
  const { today, upcoming } = useMemo(() => {
    const rows: FollowupRow[] = [];
    for (const p of patients) {
      if (!p.visits) continue;
      const latest = [...p.visits].sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0];
      if (latest?.nextConsultDate) {
        rows.push({ patient: p, visit: latest, daysUntil: dateDiffDays(latest.nextConsultDate) });
      }
    }
    return {
      today: rows.filter((r) => r.daysUntil === 0),
      upcoming: rows.filter((r) => r.daysUntil > 0 && r.daysUntil <= 7).sort((a, b) => a.daysUntil - b.daysUntil),
    };
  }, [patients]);

  return (
    <div className="space-y-5">
      <FollowupSection title={tr("followupToday", lang)} rows={today} lang={lang} icon={<BellRing className="h-4 w-4 text-rose-500" />} accent="rose" />
      <FollowupSection title={tr("followupUpcoming", lang)} rows={upcoming} lang={lang} icon={<CalendarClock className="h-4 w-4 text-blue-500" />} accent="blue" />
    </div>
  );
}

function FollowupSection({ title, rows, lang, icon, accent }: { title: string; rows: FollowupRow[]; lang: Lang; icon: React.ReactNode; accent: "rose" | "blue" }) {
  const border = accent === "rose" ? "border-rose-200 dark:border-rose-900/40" : "border-blue-200 dark:border-blue-900/40";
  return (
    <div>
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: "'Cairo', sans-serif" }}>
        {icon}
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] dark:bg-slate-700">{rows.length}</span>
        {title}
      </h3>
      {rows.length === 0 ? (
        <div className={`rounded-xl border ${border} bg-white p-4 text-center dark:bg-slate-800`}>
          <p className="text-xs text-slate-400" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("noFollowups", lang)}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map((r) => {
            const msg = lang === "ar"
              ? `مرحباً ${r.patient.name}،\nنذكرك بموعد الاستشارة القادمة مع ${"الدكتور"} بتاريخ ${formatDateAr(r.visit.nextConsultDate)} ${r.visit.nextConsultTime ? "الساعة " + r.visit.nextConsultTime : ""}.\nيرجى الحضور في الموعد المحدد. شكراً.`
              : `Hello ${r.patient.name},\nThis is a reminder for your upcoming consultation on ${formatDateAr(r.visit.nextConsultDate)} ${r.visit.nextConsultTime ? "at " + r.visit.nextConsultTime : ""}.\nPlease arrive on time. Thank you.`;
            return (
              <div key={r.patient.id + r.visit.id} className={`flex items-center gap-3 rounded-xl border ${border} bg-white p-3 dark:bg-slate-800`}>
                {r.patient.profileImage ? (
                  <img src={r.patient.profileImage} alt={r.patient.name} className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400 dark:bg-slate-700">
                    {r.patient.name?.charAt(0) ?? "P"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: "'Cairo', sans-serif" }}>{r.patient.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400" dir="ltr">{r.patient.phone}</p>
                  <p className="text-[10px] font-bold text-emerald-600" style={{ fontFamily: "'Cairo', sans-serif" }}>
                    {formatDateAr(r.visit.nextConsultDate)} {r.visit.nextConsultTime}
                  </p>
                </div>
                <a href={whatsappShareUrl(r.patient.phone, msg)} target="_blank" rel="noopener noreferrer"
                  className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:brightness-110 active:scale-95"
                  style={{ fontFamily: "'Cairo', sans-serif" }}>
                  <MessageCircle className="h-3.5 w-3.5" strokeWidth={2.4} />
                  {tr("sendReminder", lang)}
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

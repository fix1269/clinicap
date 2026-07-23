import { useMemo } from "react";
import {
  MapPin, Clock, Calendar, Stethoscope, CheckCircle2, XCircle, PauseCircle,
  Building2, MessageCircle, AlertTriangle,
} from "lucide-react";
import type { DaySchedule, Shift } from "./types";
import { todayEgyptId, todayEgyptLabel, nowEgyptTimeStr, isTimeInRange } from "./egyptTime";
import { buildWhatsAppLink } from "./links";
import SmartMedicalSearch from "./SmartMedicalSearch";
import PackagesOffers from "./PackagesOffers";
import ReviewsHub from "./ReviewsHub";
import VipLoyalty from "./VipLoyalty";
import ThemeLangToggles from "./ThemeLangToggles";
import type { Theme } from "./useTheme";
import type { Lang } from "./useLang";
import { tr } from "./i18n";
import type { Package, Review, VipSettings } from "./marketing";

interface Props {
  schedule: DaySchedule[];
  doctorName: string;
  specialty: string;
  packages: Package[];
  reviews: Review[];
  vip: VipSettings;
  theme: Theme;
  toggleTheme: () => void;
  lang: Lang;
  toggleLang: () => void;
}

export default function PatientView({ schedule, doctorName, specialty, packages, reviews, vip, theme, toggleTheme, lang, toggleLang }: Props) {
  const todayId = todayEgyptId();
  const todayLabel = todayEgyptLabel();
  const nowTime = nowEgyptTimeStr();

  const todayRow = useMemo(() => schedule.find((d) => d.id === todayId), [schedule, todayId]);
  const activeShift = useMemo(() => {
    if (!todayRow) return null;
    return todayRow.shifts.find((s) => s.status === "متواجد حالياً" && isTimeInRange(s.fromTime, s.toTime, nowTime)) ??
      todayRow.shifts.find((s) => s.status === "متواجد حالياً") ?? null;
  }, [todayRow, nowTime]);
  const activeAlert = useMemo(() => {
    for (const d of schedule) for (const s of d.shifts) if (s.alertMessage && s.alertMessage.trim() !== "") return s.alertMessage;
    return null;
  }, [schedule]);
  const isHoliday = todayRow?.shifts.every((s) => s.status === "إجازة") ?? false;
  const isDark = theme === "dark";

  const doctorNow = activeShift ? tr("doctorNow", lang, { clinic: activeShift.clinicName, to: activeShift.toTime }) : "";

  return (
    <div className={`min-h-screen ${isDark ? "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800" : "bg-gradient-to-b from-slate-50 via-white to-slate-50"}`}>
      {activeAlert && (
        <div className="sticky top-0 z-40 overflow-hidden bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 shadow-lg">
          <div className="relative flex items-center justify-center gap-2 px-4 py-2.5 text-center">
            <div className="absolute inset-0 animate-pulse bg-white/20" />
            <AlertTriangle className="relative h-4 w-4 shrink-0 text-amber-950" />
            <p className="relative text-sm font-bold text-amber-950 sm:text-base" style={{ fontFamily: "'Cairo', sans-serif" }}>{activeAlert}</p>
          </div>
        </div>
      )}

      <header className="relative overflow-hidden bg-gradient-to-br from-teal-800 via-teal-900 to-blue-900 px-5 pb-20 pt-10 text-center text-white shadow-xl">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-blue-400/20 blur-2xl" />
        <div className="absolute right-4 top-4">
          <ThemeLangToggles theme={theme} onToggleTheme={toggleTheme} lang={lang} onToggleLang={toggleLang} variant="patient" />
        </div>
        <div className="relative mx-auto max-w-md">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15 ring-4 ring-white/25 backdrop-blur">
              <Stethoscope className="h-10 w-10 text-white" strokeWidth={1.8} />
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-2 ring-white/20 backdrop-blur">
              <Building2 className="h-7 w-7 text-white" strokeWidth={1.8} />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl" style={{ fontFamily: "'Cairo', sans-serif" }}>{doctorName}</h1>
          <p className="mt-2 text-sm font-medium text-teal-100 sm:text-base" style={{ fontFamily: "'Cairo', sans-serif" }}>{specialty}</p>
        </div>
      </header>

      <div className="relative z-10 mx-auto -mt-12 max-w-md px-4">
        {todayRow && activeShift ? (
          <div className="relative overflow-hidden rounded-2xl border border-emerald-300/60 bg-gradient-to-br from-emerald-50 to-green-50 p-5 shadow-lg ring-1 ring-emerald-200 dark:border-emerald-700/60 dark:from-emerald-900/30 dark:to-green-900/20">
            <div className="absolute -right-8 -top-8 h-28 w-28 animate-ping-slow rounded-full bg-emerald-400/30" />
            <div className="relative flex items-start gap-3">
              <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
                <CheckCircle2 className="h-6 w-6" strokeWidth={2.2} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">{todayLabel} — {lang === "ar" ? "متاح الآن" : "Available now"}</p>
                <p className="mt-1 text-base font-bold leading-snug text-emerald-900 dark:text-emerald-100" style={{ fontFamily: "'Cairo', sans-serif" }}>{doctorNow}</p>
                {activeShift.address && <p className="mt-0.5 text-xs text-emerald-700 dark:text-emerald-300" style={{ fontFamily: "'Cairo', sans-serif" }}>{activeShift.address}</p>}
              </div>
            </div>
          </div>
        ) : todayRow && isHoliday ? (
          <div className="overflow-hidden rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-md dark:border-amber-800/40 dark:bg-amber-900/20">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-200 text-amber-600">
                <PauseCircle className="h-6 w-6" strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">{todayLabel}</p>
                <p className="mt-1 text-base font-bold text-amber-800 dark:text-amber-200" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("doctorOnLeave", lang)}</p>
              </div>
            </div>
          </div>
        ) : todayRow ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500 dark:bg-slate-700">
                <XCircle className="h-6 w-6" strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{todayLabel}</p>
                <p className="mt-1 text-base font-bold text-slate-700 dark:text-slate-200" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("doctorNotAvailable", lang)}</p>
                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("checkWeekBelow", lang)}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-md dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("noDataToday", lang)}</p>
          </div>
        )}
      </div>

      <main className="mx-auto max-w-md px-4 py-8">
        <SectionTitle icon={<Calendar className="h-5 w-5" />}>{tr("weekSchedule", lang)}</SectionTitle>
        <div className="space-y-4">
          {schedule.map((row) => (
            <DayCard key={row.id} row={row} isToday={row.id === todayId} todayLabel={todayLabel} lang={lang} isDark={isDark} />
          ))}
        </div>

        <div className="mt-10">
          <SectionTitle icon={<MapPin className="h-5 w-5" />}>{tr("smartSearch", lang)}</SectionTitle>
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <SmartMedicalSearch />
          </div>
        </div>

        <PackagesOffers packages={packages} lang={lang} />
        <ReviewsHub reviews={reviews} lang={lang} />
        <VipLoyalty vip={vip} lang={lang} />
      </main>
    </div>
  );
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-100">
      <span className="text-teal-700 dark:text-teal-400">{icon}</span>
      <h2 className="text-lg font-bold" style={{ fontFamily: "'Cairo', sans-serif" }}>{children}</h2>
    </div>
  );
}

function DayCard({ row, isToday, todayLabel, lang, isDark }: { row: DaySchedule; isToday: boolean; todayLabel: string; lang: Lang; isDark: boolean }) {
  return (
    <div className={`rounded-2xl border bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:bg-slate-800 ${isToday ? "border-teal-400 ring-2 ring-teal-200 dark:border-teal-500 dark:ring-teal-800" : "border-slate-100 dark:border-slate-700"}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-teal-600 dark:text-teal-400" strokeWidth={2.2} />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: "'Cairo', sans-serif" }}>{row.day}</h3>
        </div>
        {isToday && <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[10px] font-bold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">{todayLabel}</span>}
      </div>
      <div className="mt-3 space-y-3">
        {row.shifts.map((shift, idx) => <ShiftCard key={shift.id} shift={shift} dayLabel={row.day} index={idx} lang={lang} isDark={isDark} />)}
      </div>
    </div>
  );
}

function ShiftCard({ shift, dayLabel, index, lang, isDark }: { shift: Shift; dayLabel: string; index: number; lang: Lang; isDark: boolean }) {
  const isHoliday = shift.status === "إجازة";
  const isAvailable = shift.status === "متواجد حالياً";
  const waLink = buildWhatsAppLink(shift, dayLabel);

  return (
    <div className={`rounded-xl border p-3.5 ${isDark ? "border-slate-600 bg-slate-700/40" : "border-slate-100 bg-slate-50/60"}`}>
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("period", lang)} {index + 1}</span>
        <ShiftStatusBadge status={shift.status} lang={lang} />
      </div>
      <div className="flex items-start gap-2">
        <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" strokeWidth={2} />
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: "'Cairo', sans-serif" }}>{shift.clinicName || "—"}</p>
      </div>
      {shift.address && !isHoliday && (
        <div className="mt-1.5 flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" strokeWidth={2} />
          <p className="text-[12px] leading-relaxed text-slate-600 dark:text-slate-300" style={{ fontFamily: "'Cairo', sans-serif" }}>{shift.address}</p>
        </div>
      )}
      {!isHoliday && shift.fromTime && shift.toTime && (
        <div className="mt-1.5 flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" strokeWidth={2} />
          <p className="text-[12px] font-semibold text-slate-700 dark:text-slate-200" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("fromTime", lang)}: {shift.fromTime} <span className="text-slate-400 dark:text-slate-500">{tr("toTime", lang)}:</span> {shift.toTime}</p>
        </div>
      )}
      {shift.alertMessage && shift.alertMessage.trim() !== "" && (
        <div className="mt-2.5 flex items-start gap-2 rounded-lg bg-amber-50 px-2.5 py-1.5 dark:bg-amber-900/20">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-[11px] font-medium leading-snug text-amber-800 dark:text-amber-300" style={{ fontFamily: "'Cairo', sans-serif" }}>{shift.alertMessage}</p>
        </div>
      )}
      {!isHoliday && shift.phone && (
        <a href={waLink} target="_blank" rel="noopener noreferrer"
          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold shadow-md transition-all duration-200 active:scale-[0.98] ${
            isAvailable ? "bg-emerald-500 text-white shadow-emerald-200 hover:bg-emerald-600" : "bg-[#25D366] text-white shadow-green-200 hover:brightness-110"
          }`}
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          <MessageCircle className="h-4 w-4" strokeWidth={2.4} />
          {tr("bookWhatsApp", lang)}
        </a>
      )}
    </div>
  );
}

function ShiftStatusBadge({ status, lang }: { status: string; lang: Lang }) {
  if (status === "متواجد حالياً") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />{tr("available", lang)}
      </span>
    );
  }
  if (status === "إجازة") return <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">{tr("onLeave", lang)}</span>;
  return <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-400">{tr("unavailable", lang)}</span>;
}

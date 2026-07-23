import { useState } from "react";
import {
  Lock, LogOut, Calendar, Users, FileText, MapPin, Download,
  ClipboardCheck, Tag, Star, Crown,
} from "lucide-react";
import type { DaySchedule, Patient, Visit, PatientFormData } from "./types";
import { clinicConfig } from "./firebase-config";
import ScheduleManager from "./ScheduleManager";
import PatientRecords from "./PatientRecords";
import PrescriptionBuilder from "./PrescriptionBuilder";
import SmartMedicalSearch from "./SmartMedicalSearch";
import FollowupTracker from "./FollowupTracker";
import CertificateEngine from "./CertificateEngine";
import PackagesAdmin from "./PackagesAdmin";
import ReviewsAdmin from "./ReviewsAdmin";
import VipAdmin from "./VipAdmin";
import ThemeLangToggles from "./ThemeLangToggles";
import { usePwaInstallPrompt } from "./usePwaInstallPrompt";
import type { Theme } from "./useTheme";
import type { Lang } from "./useLang";
import { tr } from "./i18n";
import type { Package, Review, VipSettings } from "./marketing";

interface Props {
  schedule: DaySchedule[];
  patients: Patient[];
  selectedPatient: Patient | null;
  onSelectPatient: (p: Patient | null) => void;
  onUpdateSchedule: (day: DaySchedule) => Promise<void>;
  onAddPatient: (p: PatientFormData) => Promise<void>;
  onUpdatePatient: (id: string, p: PatientFormData) => Promise<void>;
  onSyncVisit: (patientId: string, visit: Visit) => Promise<void>;
  onLogout: () => void;
  packages: Package[];
  reviews: Review[];
  vip: VipSettings;
  onAddPackage: (p: Package) => Promise<void>;
  onUpdatePackage: (id: string, p: Partial<Package>) => Promise<void>;
  onDeletePackage: (id: string) => Promise<void>;
  onApproveReview: (id: string) => Promise<void>;
  onRejectReview: (id: string) => Promise<void>;
  onSaveVip: (v: VipSettings) => Promise<void>;
  theme: Theme;
  toggleTheme: () => void;
  lang: Lang;
  toggleLang: () => void;
}

type Tab = "schedule" | "patients" | "rx" | "followup" | "certificates" | "packages" | "reviews" | "vip";

export default function AdminPanel({
  schedule, patients, selectedPatient, onSelectPatient,
  onUpdateSchedule, onAddPatient, onUpdatePatient, onSyncVisit, onLogout,
  packages, reviews, vip,
  onAddPackage, onUpdatePackage, onDeletePackage,
  onApproveReview, onRejectReview, onSaveVip,
  theme, toggleTheme, lang, toggleLang,
}: Props) {
  const [tab, setTab] = useState<Tab>("schedule");
  const { canInstall, promptInstall } = usePwaInstallPrompt();

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "schedule", label: tr("tabSchedule", lang), icon: <Calendar className="h-3.5 w-3.5" /> },
    { id: "patients", label: tr("tabPatients", lang), icon: <Users className="h-3.5 w-3.5" /> },
    { id: "rx", label: tr("tabRx", lang), icon: <FileText className="h-3.5 w-3.5" /> },
    { id: "followup", label: tr("tabFollowup", lang), icon: <ClipboardCheck className="h-3.5 w-3.5" /> },
    { id: "certificates", label: tr("tabCertificates", lang), icon: <FileText className="h-3.5 w-3.5" /> },
    { id: "packages", label: tr("tabPackages", lang), icon: <Tag className="h-3.5 w-3.5" /> },
    { id: "reviews", label: tr("tabReviews", lang), icon: <Star className="h-3.5 w-3.5" /> },
    { id: "vip", label: tr("tabVip", lang), icon: <Crown className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-700 dark:bg-slate-800/90">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-teal-700 dark:text-teal-400" strokeWidth={2.2} />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("doctorPanel", lang)}</h2>
          </div>
          <div className="flex items-center gap-2">
            <ThemeLangToggles theme={theme} onToggleTheme={toggleTheme} lang={lang} onToggleLang={toggleLang} variant="admin" />
            {canInstall && (
              <button onClick={promptInstall}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-teal-700"
                style={{ fontFamily: "'Cairo', sans-serif" }}>
                <Download className="h-3.5 w-3.5" strokeWidth={2.4} /> {tr("installApp", lang)}
              </button>
            )}
            <button onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
              style={{ fontFamily: "'Cairo', sans-serif" }}>
              <LogOut className="h-3.5 w-3.5" strokeWidth={2.4} /> {tr("logout", lang)}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-md px-4 py-4">
        <div className="no-print mb-5 grid grid-cols-4 gap-2">
          {tabs.map((t) => (
            <TabButton key={t.id} active={tab === t.id} onClick={() => setTab(t.id)} icon={t.icon} label={t.label} />
          ))}
        </div>

        <div className="no-print mb-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-3 flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <MapPin className="h-4 w-4 text-teal-700 dark:text-teal-400" />
            <h3 className="text-sm font-bold" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("smartSearch", lang)}</h3>
          </div>
          <SmartMedicalSearch />
        </div>

        {tab === "schedule" && <ScheduleManager schedule={schedule} onUpdate={onUpdateSchedule} />}
        {tab === "patients" && (
          <PatientRecords patients={patients} selectedPatient={selectedPatient} onSelectPatient={onSelectPatient}
            onAddPatient={onAddPatient} onUpdatePatient={onUpdatePatient} />
        )}
        {tab === "rx" && <PrescriptionBuilder selectedPatient={selectedPatient} onSyncVisit={onSyncVisit} />}
        {tab === "followup" && <FollowupTracker patients={patients} lang={lang} />}
        {tab === "certificates" && <CertificateEngine lang={lang} />}
        {tab === "packages" && (
          <PackagesAdmin packages={packages} lang={lang} onAdd={onAddPackage} onUpdate={onUpdatePackage} onDelete={onDeletePackage} />
        )}
        {tab === "reviews" && (
          <ReviewsAdmin reviews={reviews} lang={lang} onApprove={onApproveReview} onReject={onRejectReview} />
        )}
        {tab === "vip" && <VipAdmin vip={vip} lang={lang} onSave={onSaveVip} />}

        <p className="no-print mt-6 text-center text-[10px] text-slate-300 dark:text-slate-600">
          {clinicConfig.doctorName} — {tr("doctorPanel", lang)}
        </p>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-bold transition ${
        active ? "bg-teal-600 text-white shadow-md shadow-teal-200 dark:shadow-teal-900" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-700"
      }`}
      style={{ fontFamily: "'Cairo', sans-serif" }}>
      {icon}{label}
    </button>
  );
}

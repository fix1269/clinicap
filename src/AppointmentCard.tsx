import { useState } from "react";
import { Search, User, Calendar, Clock, FileText, AlertCircle, Loader2, Heart, Activity } from "lucide-react";
import type { Patient } from "./types";
import { formatDateAr } from "./egyptTime";

interface Props {
  patients: Patient[];
  loading: boolean;
}

export default function AppointmentCard({ patients, loading }: Props) {
  const [name, setName] = useState("");
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<Patient | null>(null);
  const [searching, setSearching] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearching(true);
    setSearched(true);
    const trimmed = name.trim();
    // Exact match against the patient's full name field
    setTimeout(() => {
      const found = patients.find((p) => p.name.trim() === trimmed) ?? null;
      setResult(found);
      setSearching(false);
    }, 500);
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="space-y-2">
        <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>الاسم الرباعي للمريض</label>
        <div className="relative">
          <User className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: مينا موريس عبده حنا"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-10 pl-3 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          />
        </div>
        <button type="submit" disabled={searching || !name.trim()}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-teal-200 transition hover:bg-teal-700 active:scale-[0.98] disabled:opacity-50"
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          عرض كارت المتابعة
        </button>
      </form>

      {loading && !searched && (
        <p className="mt-4 text-center text-xs text-slate-400" style={{ fontFamily: "'Cairo', sans-serif" }}>جارٍ تحميل بيانات المرضى...</p>
      )}

      {searching && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
          <p className="text-xs text-slate-500" style={{ fontFamily: "'Cairo', sans-serif" }}>جارٍ البحث...</p>
        </div>
      )}

      {searched && !searching && !result && (
        <div className="mt-6 flex flex-col items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
          <AlertCircle className="h-8 w-8 text-amber-500" />
          <p className="text-sm font-bold text-amber-800" style={{ fontFamily: "'Cairo', sans-serif" }}>
            عذراً، الاسم غير مسجل بالكامل. يرجى إدخال الاسم الرباعي دقيقاً كما هو مسجل في العيادة
          </p>
        </div>
      )}

      {searched && !searching && result && <PatientCard patient={result} />}
    </div>
  );
}

function PatientCard({ patient }: { patient: Patient }) {
  const sortedVisits = [...(patient.visits ?? [])].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const nextVisit = sortedVisits.find((v) => v.nextConsultDate) ?? null;

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-teal-200 bg-white shadow-lg">
      <div className="bg-gradient-to-br from-teal-700 to-blue-800 px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          {patient.profileImage ? (
            <img src={patient.profileImage} alt={patient.name} className="h-12 w-12 rounded-full object-cover ring-2 ring-white/25" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 ring-2 ring-white/25">
              <User className="h-6 w-6" strokeWidth={1.8} />
            </div>
          )}
          <div>
            <p className="text-base font-extrabold" style={{ fontFamily: "'Cairo', sans-serif" }}>{patient.name}</p>
            <p className="text-xs text-teal-100" style={{ fontFamily: "'Cairo', sans-serif" }}>السن: {patient.age || "—"} سنة</p>
          </div>
        </div>
      </div>

      {nextVisit && nextVisit.nextConsultDate ? (
        <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-green-50 px-5 py-4">
          <div className="absolute -right-6 -top-6 h-20 w-20 animate-ping-slow rounded-full bg-emerald-400/20" />
          <div className="relative flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow">
              <Calendar className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-600">موعد الاستشارة القادمة</p>
              <p className="mt-0.5 text-sm font-extrabold text-emerald-900" style={{ fontFamily: "'Cairo', sans-serif" }}>
                {formatDateAr(nextVisit.nextConsultDate)}{nextVisit.nextConsultTime ? ` — الساعة ${nextVisit.nextConsultTime}` : ""}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-b border-slate-100 bg-slate-50 px-5 py-3 text-center">
          <p className="text-xs text-slate-400" style={{ fontFamily: "'Cairo', sans-serif" }}>لا يوجد موعد استشارة قادم</p>
        </div>
      )}

      {patient.chronicDiseases && (
        <div className="flex items-start gap-2 border-b border-slate-100 px-5 py-3">
          <Heart className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" strokeWidth={2} />
          <div>
            <p className="text-[11px] font-bold text-slate-400" style={{ fontFamily: "'Cairo', sans-serif" }}>أمراض مزمنة / ملاحظات</p>
            <p className="text-xs text-slate-600" style={{ fontFamily: "'Cairo', sans-serif" }}>{patient.chronicDiseases}</p>
          </div>
        </div>
      )}

      <div className="px-5 py-4">
        <div className="mb-3 flex items-center gap-2">
          <Activity className="h-4 w-4 text-teal-600" strokeWidth={2.2} />
          <h3 className="text-sm font-bold text-slate-800" style={{ fontFamily: "'Cairo', sans-serif" }}>سجل المتابعة الطبية</h3>
        </div>
        {sortedVisits.length === 0 ? (
          <p className="py-3 text-center text-xs text-slate-400" style={{ fontFamily: "'Cairo', sans-serif" }}>لا توجد زيارات مسجلة بعد</p>
        ) : (
          <div className="space-y-3">
            {sortedVisits.map((visit, i) => (
              <div key={visit.id} className="relative rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                <div className="absolute -right-[18px] top-4 h-2.5 w-2.5 rounded-full bg-teal-500 ring-2 ring-white" />
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-teal-600" />
                  <p className="text-xs font-bold text-slate-700" style={{ fontFamily: "'Cairo', sans-serif" }}>{formatDateAr(visit.date)}</p>
                </div>
                {visit.diagnosis && (
                  <p className="mt-1.5 text-xs text-slate-600" style={{ fontFamily: "'Cairo', sans-serif" }}>
                    <span className="font-bold text-slate-700">التشخيص: </span>{visit.diagnosis}
                  </p>
                )}
                {visit.medications && visit.medications.length > 0 && (
                  <div className="mt-1.5">
                    <p className="text-[11px] font-bold text-slate-500" style={{ fontFamily: "'Cairo', sans-serif" }}>الأدوية:</p>
                    <ul className="mt-1 space-y-0.5">
                      {visit.medications.map((m) => (
                        <li key={m.id} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                          <FileText className="mt-0.5 h-3 w-3 shrink-0 text-teal-500" />
                          <span><span className="font-bold" dir="ltr">{m.drugName}</span> — <span style={{ fontFamily: "'Cairo', sans-serif" }}>{m.dosage}</span></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {visit.notes && (
                  <p className="mt-1.5 text-[11px] text-slate-500" style={{ fontFamily: "'Cairo', sans-serif" }}>
                    <span className="font-bold">توصيات: </span>{visit.notes}
                  </p>
                )}
                {visit.nextConsultDate && i === 0 && nextVisit?.id === visit.id && (
                  <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-1">
                    <Clock className="h-3 w-3 text-emerald-600" />
                    <p className="text-[10px] font-bold text-emerald-700" style={{ fontFamily: "'Cairo', sans-serif" }}>
                      الاستشارة القادمة: {formatDateAr(visit.nextConsultDate)} {visit.nextConsultTime}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Plus, Trash2, Printer, Stethoscope, Building2, User, Calendar, Loader2, AlertCircle, CheckCircle2, MessageCircle, Mail } from "lucide-react";
import type { Patient, PrescriptionItem, Visit } from "./types";
import { clinicConfig } from "./firebase-config";
import { formatDateAr } from "./egyptTime";
import { newUid } from "./defaults";
import { whatsappShareUrl, emailShareUrl, shareRxSummary } from "./marketing";

interface Props {
  selectedPatient: Patient | null;
  onSyncVisit: (patientId: string, visit: Visit) => Promise<void>;
}

export default function PrescriptionBuilder({ selectedPatient, onSyncVisit }: Props) {
  const [diagnosis, setDiagnosis] = useState("");
  const [meds, setMeds] = useState<PrescriptionItem[]>([]);
  const [drugName, setDrugName] = useState("");
  const [dosage, setDosage] = useState("قرص قبل الأكل بثلاثين دقيقة");
  const [nextDate, setNextDate] = useState("");
  const [nextTime, setNextTime] = useState("");
  const [notes, setNotes] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addMed() {
    if (!drugName) return;
    setMeds((prev) => [...prev, { id: newUid(), drugName, dosage }]);
    setDrugName("");
    setDosage("قرص قبل الأكل بثلاثين دقيقة");
  }
  function removeMed(id: string) { setMeds((prev) => prev.filter((m) => m.id !== id)); }

  async function handlePrintAndSync() {
    if (!selectedPatient) return;
    setSyncing(true); setError(null); setSynced(false);
    try {
      const visit: Visit = {
        id: newUid(), date: new Date().toISOString().slice(0, 10),
        diagnosis, medications: meds, nextConsultDate: nextDate, nextConsultTime: nextTime, notes,
      };
      await onSyncVisit(selectedPatient.id, visit);
      setSynced(true);
      setTimeout(() => setSynced(false), 2500);
      window.print();
      setDiagnosis(""); setMeds([]); setNextDate(""); setNextTime(""); setNotes("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل المزامنة");
    } finally { setSyncing(false); }
  }

  if (!selectedPatient) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <User className="h-10 w-10 text-slate-300" />
        <p className="text-sm font-bold text-slate-500 dark:text-slate-300" style={{ fontFamily: "'Cairo', sans-serif" }}>اختر مريضاً من تبويب "المرضى" أولاً</p>
        <p className="text-xs text-slate-400 dark:text-slate-500" style={{ fontFamily: "'Cairo', sans-serif" }}>يجب اختيار مريض لربط الروشتة بملفه الطبي</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-teal-200 bg-teal-50/40 p-4">
        {selectedPatient.profileImage ? (
          <img src={selectedPatient.profileImage} alt={selectedPatient.name} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white">
            <User className="h-5 w-5" strokeWidth={2} />
          </div>
        )}
        <div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: "'Cairo', sans-serif" }}>{selectedPatient.name}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400" dir="ltr">{selectedPatient.phone} — السن: {selectedPatient.age || "—"}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>التشخيص</label>
        <textarea value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} rows={2}
          placeholder="مثال: التهاب المعدة المزمن" className="input resize-none" style={{ fontFamily: "'Cairo', sans-serif" }} />
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200" style={{ fontFamily: "'Cairo', sans-serif" }}>الأدوية</h3>
        <div className="space-y-3">
          <div>
            <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>اسم الدواء</label>
            <input type="text" value={drugName} onChange={(e) => setDrugName(e.target.value)} placeholder="مثال: Controloc 40mg" className="input" dir="ltr" />
          </div>
          <div>
            <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>تعليمات الجرعة</label>
            <input type="text" value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="مثال: قرص قبل الأكل بثلاثين دقيقة" className="input" style={{ fontFamily: "'Cairo', sans-serif" }} />
          </div>
          <button type="button" onClick={addMed} disabled={!drugName}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-teal-300 py-2.5 text-xs font-bold text-teal-600 transition hover:bg-teal-50 disabled:opacity-50"
            style={{ fontFamily: "'Cairo', sans-serif" }}>
            <Plus className="h-3.5 w-3.5" /> إضافة للقائمة
          </button>
        </div>
        {meds.length > 0 && (
          <div className="mt-3 space-y-2">
            {meds.map((m) => (
              <div key={m.id} className="flex items-start justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div>
                  <p className="text-sm font-bold text-slate-800" dir="ltr">{m.drugName}</p>
                  <p className="text-[11px] text-slate-500" style={{ fontFamily: "'Cairo', sans-serif" }}>{m.dosage}</p>
                </div>
                <button type="button" onClick={() => removeMed(m.id)} className="rounded-lg bg-red-50 p-1.5 text-red-600 transition hover:bg-red-100">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>موعد الاستشارة القادمة</label>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="date" dir="ltr" value={nextDate} onChange={(e) => setNextDate(e.target.value)} className="input pl-10 text-center" />
          </div>
          <input type="time" dir="ltr" value={nextTime} onChange={(e) => setNextTime(e.target.value)} className="input text-center" />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>توصيات / ملاحظات</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
          placeholder="مثال: إجراء أشعة على البطن قبل الزيارة القادمة" className="input resize-none" style={{ fontFamily: "'Cairo', sans-serif" }} />
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />{error}
        </div>
      )}
      {synced && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-bold text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> تم حفظ الزيارة في ملف المريض وفتح نافذة الطباعة
        </div>
      )}

      <button type="button" onClick={handlePrintAndSync} disabled={syncing || meds.length === 0}
        className="no-print mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-800 active:scale-[0.98] disabled:opacity-50"
        style={{ fontFamily: "'Cairo', sans-serif" }}>
        {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" strokeWidth={2.4} />}
        {syncing ? "جارٍ المزامنة..." : "طباعة الروشتة ومزامنة الكارت"}
      </button>

      <div className="no-print mt-2 grid grid-cols-2 gap-2">
        <a href={whatsappShareUrl(selectedPatient.phone, shareRxSummary({ patientName: selectedPatient.name, patientAge: selectedPatient.age, diagnosis, meds: meds.map(m => ({ drugName: m.drugName, dosage: m.dosage })), nextDate, nextTime, notes }, clinicConfig.doctorName, clinicConfig.specialty, "ar"))} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] py-2.5 text-xs font-bold text-white shadow-md transition hover:brightness-110 active:scale-[0.98]"
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          <MessageCircle className="h-3.5 w-3.5" /> مشاركة واتساب
        </a>
        <a href={emailShareUrl("روشتة طبية", shareRxSummary({ patientName: selectedPatient.name, patientAge: selectedPatient.age, diagnosis, meds: meds.map(m => ({ drugName: m.drugName, dosage: m.dosage })), nextDate, nextTime, notes }, clinicConfig.doctorName, clinicConfig.specialty, "ar"))}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-600 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-slate-700 active:scale-[0.98]"
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          <Mail className="h-3.5 w-3.5" /> مشاركة إيميل
        </a>
      </div>

      <div id="print-prescription" className="no-print hidden">
        <PrintSheet doctorName={clinicConfig.doctorName} specialty={clinicConfig.specialty}
          patientName={selectedPatient.name} patientAge={selectedPatient.age}
          diagnosis={diagnosis} meds={meds} nextDate={nextDate} nextTime={nextTime} notes={notes} />
      </div>
    </div>
  );
}

function PrintSheet({ doctorName, specialty, patientName, patientAge, diagnosis, meds, nextDate, nextTime, notes }: {
  doctorName: string; specialty: string; patientName: string; patientAge: string;
  diagnosis: string; meds: PrescriptionItem[]; nextDate: string; nextTime: string; notes: string;
}) {
  const today = new Date().toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
  return (
    <div style={{ fontFamily: "'Cairo', sans-serif", padding: "40px", color: "#1e293b", direction: "rtl" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "3px solid #0f766e", paddingBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#0f766e", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
            <Stethoscope size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 800, margin: 0, color: "#0f766e" }}>{doctorName}</h1>
            <p style={{ fontSize: "13px", margin: 0, color: "#475569" }}>{specialty}</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#0f766e" }}>
          <Building2 size={20} />
          <span style={{ fontSize: "12px", fontWeight: 700 }}>عيادة الباطنة والجهاز الهضمي</span>
        </div>
      </div>
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
        <div><strong>اسم المريض: </strong><span>{patientName || "—"}</span></div>
        <div><strong>السن: </strong><span>{patientAge || "—"}</span></div>
        <div><strong>التاريخ: </strong><span>{today}</span></div>
      </div>
      {diagnosis && <div style={{ marginTop: "16px", fontSize: "13px" }}><strong>التشخيص: </strong><span>{diagnosis}</span></div>}
      <div style={{ marginTop: "20px", fontSize: "28px", fontWeight: 800, color: "#0f766e" }}>℞</div>
      <ol style={{ marginTop: "10px", padding: 0, listStyle: "none" }}>
        {meds.map((m, i) => (
          <li key={m.id} style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px dashed #cbd5e1" }}>
            <span style={{ fontWeight: 800, color: "#0f766e", minWidth: "24px" }}>{i + 1}.</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: "14px" }} dir="ltr">{m.drugName}</div>
              <div style={{ fontSize: "13px", marginTop: "2px" }}>{m.dosage}</div>
            </div>
          </li>
        ))}
      </ol>
      {notes && <div style={{ marginTop: "16px", fontSize: "12px", color: "#64748b" }}><strong>توصيات: </strong><span>{notes}</span></div>}
      {nextDate && (
        <div style={{ marginTop: "16px", padding: "10px 14px", background: "#ecfdf5", borderRadius: "8px", border: "1px solid #a7f3d0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: "#047857" }}>
            <Calendar size={16} /> موعد الاستشارة القادمة: {formatDateAr(nextDate)} {nextTime}
          </div>
        </div>
      )}
      <div style={{ marginTop: "48px", display: "flex", justifyContent: "flex-start" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ borderTop: "1px solid #475569", width: "180px", paddingTop: "6px", fontSize: "12px", color: "#475569" }}>توقيع الطبيب</div>
        </div>
      </div>
    </div>
  );
}

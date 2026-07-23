import { useState } from "react";
import { Printer, MessageCircle, Mail, FileText, Stethoscope, Building2 } from "lucide-react";
import type { Lang } from "./useLang";
import { tr } from "./i18n";
import { clinicConfig } from "./firebase-config";
import { whatsappShareUrl, emailShareUrl, shareCertificateSummary } from "./marketing";
import type { CertificateData } from "./marketing";

interface Props {
  lang: Lang;
}

export default function CertificateEngine({ lang }: Props) {
  const [data, setData] = useState<CertificateData>({
    patientName: "", diagnosis: "", durationDays: "", notes: "", date: new Date().toISOString().slice(0, 10),
  });

  function set<K extends keyof CertificateData>(k: K, v: CertificateData[K]) {
    setData((prev) => ({ ...prev, [k]: v }));
  }

  function handlePrint() {
    window.print();
  }

  const ar = lang === "ar";
  const summary = shareCertificateSummary(data, clinicConfig.doctorName, clinicConfig.specialty, lang);
  const today = new Date().toLocaleDateString(ar ? "ar-EG" : "en-GB", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="space-y-3">
          <div>
            <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("certPatient", lang)}</label>
            <input value={data.patientName} onChange={(e) => set("patientName", e.target.value)} className="input" style={{ fontFamily: "'Cairo', sans-serif" }} />
          </div>
          <div>
            <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("certDiagnosis", lang)}</label>
            <textarea value={data.diagnosis} onChange={(e) => set("diagnosis", e.target.value)} rows={2} className="input resize-none" style={{ fontFamily: "'Cairo', sans-serif" }} />
          </div>
          <div>
            <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("certDuration", lang)}</label>
            <input value={data.durationDays} onChange={(e) => set("durationDays", e.target.value)} inputMode="numeric" className="input" dir="ltr" />
          </div>
          <div>
            <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("certNotes", lang)}</label>
            <textarea value={data.notes} onChange={(e) => set("notes", e.target.value)} rows={2} className="input resize-none" style={{ fontFamily: "'Cairo', sans-serif" }} />
          </div>
        </div>
      </div>

      <div className="no-print mt-4 grid grid-cols-3 gap-2">
        <button type="button" onClick={handlePrint}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-700 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-800 active:scale-[0.98]"
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          <Printer className="h-3.5 w-3.5" /> {tr("print", lang)}
        </button>
        <a href={whatsappShareUrl("", summary)} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] py-2.5 text-xs font-bold text-white shadow-md transition hover:brightness-110 active:scale-[0.98]"
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          <MessageCircle className="h-3.5 w-3.5" /> {tr("shareWhatsApp", lang)}
        </a>
        <a href={emailShareUrl(ar ? "شهادة طبية" : "Medical Certificate", summary)}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-600 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-slate-700 active:scale-[0.98]"
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          <Mail className="h-3.5 w-3.5" /> {tr("shareEmail", lang)}
        </a>
      </div>

      <div id="print-prescription" aria-hidden="true" className="no-print hidden">
        <CertificatePrint data={data} doctorName={clinicConfig.doctorName} specialty={clinicConfig.specialty} dateLabel={today} lang={lang} />
      </div>
    </div>
  );
}

function CertificatePrint({ data, doctorName, specialty, dateLabel, lang }: {
  data: CertificateData; doctorName: string; specialty: string; dateLabel: string; lang: Lang;
}) {
  const ar = lang === "ar";
  return (
    <div style={{ fontFamily: "'Cairo', sans-serif", padding: "40px", color: "#1e293b", direction: ar ? "rtl" : "ltr" }}>
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
          <span style={{ fontSize: "12px", fontWeight: 700 }}>{tr("internalClinic", lang)}</span>
        </div>
      </div>

      <div style={{ textAlign: "center", margin: "24px 0" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 20px", background: "#0f766e", color: "white", borderRadius: "10px" }}>
          <FileText size={20} />
          <span style={{ fontSize: "18px", fontWeight: 800 }}>{ar ? "شهادة طبية / إجازة مرضية" : "Medical Certificate / Sick Leave"}</span>
        </div>
      </div>

      <div style={{ fontSize: "14px", lineHeight: 2 }}>
        <div style={{ marginBottom: "12px" }}>
          <strong>{tr("patientLabel", lang)}: </strong>
          <span style={{ fontWeight: 700, color: "#0f766e" }}>{data.patientName || "—"}</span>
        </div>
        <div style={{ marginBottom: "12px" }}>
          <strong>{tr("certDiagnosis", lang)}: </strong>
          <span>{data.diagnosis || "—"}</span>
        </div>
        <div style={{ marginBottom: "12px" }}>
          <strong>{ar ? "يحتاج المريض إلى إجازة مرضية لمدة" : "The patient requires sick leave for"} </strong>
          <span style={{ fontWeight: 800, color: "#b91c1c", fontSize: "18px" }}> {data.durationDays || "—"} </span>
          <strong> {tr("days", lang)}.</strong>
        </div>
        {data.notes && (
          <div style={{ marginBottom: "12px" }}>
            <strong>{tr("certNotes", lang)}: </strong>
            <span>{data.notes}</span>
          </div>
        )}
        <div>
          <strong>{tr("dateLabel", lang)}: </strong>
          <span>{dateLabel}</span>
        </div>
      </div>

      <div style={{ marginTop: "60px", display: "flex", justifyContent: ar ? "flex-start" : "flex-end" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ borderTop: "1px solid #475569", width: "180px", paddingTop: "6px", fontSize: "12px", color: "#475569" }}>{tr("doctorSignature", lang)}</div>
          <div style={{ marginTop: "4px", fontSize: "11px", color: "#94a3b8" }}>{doctorName}</div>
        </div>
      </div>
    </div>
  );
}

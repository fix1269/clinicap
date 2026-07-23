import type { Patient } from "./types";
import { clinicConfig } from "./firebase-config";

interface Props {
  patient: Patient;
}

export default function MedicalCardPrint({ patient }: Props) {
  return (
    <div id="print-medical-card" aria-hidden="true">
      <div className="medical-card-sheet" style={sheetStyle}>
        <div className="medical-card-header" style={headerStyle}>
          <div style={headerIconStyle}>
            <StethoscopeGlyph />
          </div>
          <div style={{ flex: 1 }}>
            <div className="card-doctor-name" style={doctorNameStyle}>{clinicConfig.doctorName}</div>
            <div className="card-specialty" style={specialtyStyle}>{clinicConfig.specialty}</div>
          </div>
          <div className="card-badge" style={badgeStyle}>كارت المتابعة الطبية</div>
        </div>

        <div className="medical-card-body" style={bodyStyle}>
          <div style={profileRowStyle}>
            {patient.profileImage ? (
              <img src={patient.profileImage} alt={patient.name} style={profileImgStyle} />
            ) : (
              <div className="profile-placeholder" style={profilePlaceholderStyle}>
                <UserGlyph />
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div className="card-patient-name" style={patientNameStyle}>{patient.name}</div>
              <div className="card-sub" style={patientSubStyle}>
                <PhoneGlyph /> <span dir="ltr">{patient.phone || "—"}</span>
              </div>
              <div className="card-sub" style={patientSubStyle}>السن: {patient.age || "—"} سنة</div>
            </div>
          </div>

          <div className="medical-card-vitals" style={vitalsGridStyle}>
            <VitalCell label="فصيلة الدم" value={patient.bloodType} />
            <VitalCell label="الضغط" value={patient.bloodPressure} />
            <VitalCell label="الطول" value={patient.height ? patient.height + " سم" : ""} />
            <VitalCell label="الوزن" value={patient.weight ? patient.weight + " كجم" : ""} />
          </div>

          {patient.drugAllergies && (
            <div className="card-allergy" style={allergyStyle}>
              ⚠ حساسية من الأدوية: <strong>{patient.drugAllergies}</strong>
            </div>
          )}

          {patient.chronicDiseases && (
            <div className="card-chronic" style={chronicStyle}>
              أمراض مزمنة / ملاحظات: <strong>{patient.chronicDiseases}</strong>
            </div>
          )}
        </div>

        <div className="medical-card-footer" style={footerStyle}>
          <span className="card-footer-text">{clinicConfig.doctorName} — {clinicConfig.specialty}</span>
        </div>
      </div>
    </div>
  );
}

function VitalCell({ label, value }: { label: string; value: string }) {
  return (
    <div style={vitalCellStyle}>
      <span className="vital-label" style={vitalLabelStyle}>{label}:</span>
      <span className="vital-value" style={vitalValueStyle}>{value || "—"}</span>
    </div>
  );
}

function StethoscopeGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  );
}
function UserGlyph() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function PhoneGlyph() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

const sheetStyle: React.CSSProperties = {
  fontFamily: "'Cairo', sans-serif",
  direction: "rtl",
  color: "#1e293b",
  background: "white",
  border: "2px solid #0f766e",
  borderRadius: "14px",
  overflow: "hidden",
  boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
};
const headerStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #0f766e, #1e3a8a)",
  padding: "10px 14px",
  color: "white",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};
const headerIconStyle: React.CSSProperties = {
  width: "34px",
  height: "34px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};
const doctorNameStyle: React.CSSProperties = { fontSize: "13px", fontWeight: 800, lineHeight: 1.2 };
const specialtyStyle: React.CSSProperties = { fontSize: "9px", opacity: 0.85, marginTop: "1px" };
const badgeStyle: React.CSSProperties = {
  fontSize: "8px",
  fontWeight: 700,
  background: "rgba(255,255,255,0.2)",
  padding: "3px 7px",
  borderRadius: "6px",
  flexShrink: 0,
};
const bodyStyle: React.CSSProperties = { padding: "12px 14px" };
const profileRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  paddingBottom: "10px",
  borderBottom: "1px solid #e2e8f0",
};
const profileImgStyle: React.CSSProperties = {
  width: "52px",
  height: "52px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "2px solid #0f766e",
  flexShrink: 0,
};
const profilePlaceholderStyle: React.CSSProperties = {
  width: "52px",
  height: "52px",
  borderRadius: "50%",
  background: "#f1f5f9",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "2px solid #0f766e",
  flexShrink: 0,
};
const patientNameStyle: React.CSSProperties = { fontSize: "14px", fontWeight: 800, color: "#0f766e", lineHeight: 1.2 };
const patientSubStyle: React.CSSProperties = { fontSize: "10px", color: "#64748b", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" };
const vitalsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "6px",
  paddingTop: "10px",
};
const vitalCellStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "5px",
  padding: "5px 7px",
  background: "#f8fafc",
  borderRadius: "6px",
};
const vitalLabelStyle: React.CSSProperties = { fontSize: "9px", fontWeight: 700, color: "#475569" };
const vitalValueStyle: React.CSSProperties = { fontSize: "10px", fontWeight: 600, color: "#1e293b" };
const allergyStyle: React.CSSProperties = {
  marginTop: "8px",
  padding: "6px 8px",
  background: "#fef2f2",
  borderRadius: "6px",
  border: "1px solid #fecaca",
  fontSize: "9px",
  fontWeight: 700,
  color: "#b91c1c",
};
const chronicStyle: React.CSSProperties = {
  marginTop: "6px",
  padding: "6px 8px",
  background: "#f0fdf4",
  borderRadius: "6px",
  border: "1px solid #bbf7d0",
  fontSize: "9px",
  fontWeight: 700,
  color: "#047857",
};
const footerStyle: React.CSSProperties = {
  background: "#f8fafc",
  padding: "6px 14px",
  borderTop: "1px solid #e2e8f0",
  textAlign: "center",
  fontSize: "8px",
  color: "#94a3b8",
};

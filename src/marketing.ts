import type { Lang } from "./useLang";

export interface Package {
  id: string;
  name: string;
  price: string;
  discount: string;
  services: string;
  active: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  approved: boolean;
  createdAt: string;
}

export interface VipSettings {
  discountPercent: string;
}

export interface ClinicSettings {
  adminPassword: string;
  vipDiscount: string;
}

export interface CertificateData {
  patientName: string;
  diagnosis: string;
  durationDays: string;
  notes: string;
  date: string;
}

export function normalizePackage(data: Record<string, unknown>, id: string): Package {
  return {
    id,
    name: (data.name as string) ?? "",
    price: (data.price as string) ?? "",
    discount: (data.discount as string) ?? "",
    services: (data.services as string) ?? "",
    active: (data.active as boolean) ?? false,
    createdAt: (data.createdAt as string) ?? "",
  };
}

export function normalizeReview(data: Record<string, unknown>, id: string): Review {
  return {
    id,
    name: (data.name as string) ?? "",
    rating: (data.rating as number) ?? 5,
    text: (data.text as string) ?? "",
    approved: (data.approved as boolean) ?? false,
    createdAt: (data.createdAt as string) ?? "",
  };
}

export function normalizeVip(data: Record<string, unknown>): VipSettings {
  return { discountPercent: (data.discountPercent as string) ?? "10" };
}

export function generateVipCode(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `DR-VIP-${n}`;
}

export function whatsappShareUrl(phone: string, message: string): string {
  const clean = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function emailShareUrl(subject: string, body: string): string {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function sharePatientCardSummary(p: {
  name: string; phone: string; age: string; bloodType: string;
  bloodPressure: string; height: string; weight: string;
  drugAllergies: string; chronicDiseases: string;
}, doctorName: string, lang: Lang): string {
  const ar = lang === "ar";
  const lines = [
    `🪪 ${ar ? "كارت المتابعة الطبية" : "Medical Follow-up Card"} — ${doctorName}`,
    "",
    `${ar ? "اسم المريض" : "Patient"}: ${p.name}`,
    `${ar ? "الهاتف" : "Phone"}: ${p.phone}`,
    `${ar ? "السن" : "Age"}: ${p.age} ${ar ? "سنة" : "yrs"}`,
    `${ar ? "فصيلة الدم" : "Blood Type"}: ${p.bloodType}`,
    `${ar ? "الضغط" : "BP"}: ${p.bloodPressure}`,
    `${ar ? "الطول" : "Height"}: ${p.height} ${ar ? "سم" : "cm"}  |  ${ar ? "الوزن" : "Weight"}: ${p.weight} ${ar ? "كجم" : "kg"}`,
    p.drugAllergies ? `${ar ? "حساسية أدوية" : "Drug Allergies"}: ${p.drugAllergies}` : "",
    p.chronicDiseases ? `${ar ? "أمراض مزمنة" : "Chronic Diseases"}: ${p.chronicDiseases}` : "",
    "",
    `— ${doctorName}`,
  ];
  return lines.filter(Boolean).join("\n");
}

export function shareRxSummary(d: {
  patientName: string; patientAge: string; diagnosis: string;
  meds: { drugName: string; dosage: string }[];
  nextDate: string; nextTime: string; notes: string;
}, doctorName: string, specialty: string, lang: Lang): string {
  const ar = lang === "ar";
  const medLines = d.meds.map((m, i) => `${i + 1}. ${m.drugName} — ${m.dosage}`);
  const lines = [
    `℞ ${ar ? "روشتة طبية" : "Medical Prescription"} — ${doctorName}`,
    `${specialty}`,
    "",
    `${ar ? "اسم المريض" : "Patient"}: ${d.patientName}`,
    `${ar ? "السن" : "Age"}: ${d.patientAge}`,
    d.diagnosis ? `${ar ? "التشخيص" : "Diagnosis"}: ${d.diagnosis}` : "",
    "",
    ar ? "الأدوية:" : "Medications:",
    ...medLines,
    "",
    d.notes ? `${ar ? "توصيات" : "Notes"}: ${d.notes}` : "",
    d.nextDate ? `${ar ? "الاستشارة القادمة" : "Next consult"}: ${d.nextDate} ${d.nextTime}` : "",
    "",
    `— ${doctorName}`,
  ];
  return lines.filter(Boolean).join("\n");
}

export function shareCertificateSummary(c: CertificateData, doctorName: string, specialty: string, lang: Lang): string {
  const ar = lang === "ar";
  const lines = [
    `📄 ${ar ? "شهادة طبية / إجازة مرضية" : "Medical Certificate / Sick Leave"} — ${doctorName}`,
    `${specialty}`,
    "",
    `${ar ? "اسم المريض" : "Patient"}: ${c.patientName}`,
    `${ar ? "التشخيص" : "Diagnosis"}: ${c.diagnosis}`,
    `${ar ? "مدة الإجازة" : "Leave duration"}: ${c.durationDays} ${ar ? "يوم" : "days"}`,
    c.notes ? `${ar ? "ملاحظات" : "Notes"}: ${c.notes}` : "",
    `${ar ? "التاريخ" : "Date"}: ${c.date}`,
    "",
    `— ${doctorName}`,
  ];
  return lines.filter(Boolean).join("\n");
}

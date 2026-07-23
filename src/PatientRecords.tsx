import { useMemo, useState, useRef, useEffect } from "react";
import {
  UserPlus, Search, User, Phone, Heart, Calendar, FileText, ArrowRight, X,
  ImagePlus, Ruler, Weight, Droplet, HeartPulse, AlertTriangle, Paperclip, Loader2, Printer, Trash2, Pencil, MessageCircle, Mail,
} from "lucide-react";
import type { Patient, Attachment, PatientFormData } from "./types";
import { formatDateAr } from "./egyptTime";
import { fileToCompressedDataUrl, filesToAttachments } from "./fileUtils";
import MedicalCardPrint from "./MedicalCardPrint";
import { clinicConfig } from "./firebase-config";
import { whatsappShareUrl, emailShareUrl, sharePatientCardSummary } from "./marketing";

interface Props {
  patients: Patient[];
  selectedPatient: Patient | null;
  onSelectPatient: (p: Patient | null) => void;
  onAddPatient: (p: PatientFormData) => Promise<void>;
  onUpdatePatient: (id: string, p: PatientFormData) => Promise<void>;
}

export default function PatientRecords({ patients, selectedPatient, onSelectPatient, onAddPatient, onUpdatePatient }: Props) {
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [printPatient, setPrintPatient] = useState<Patient | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return patients;
    return patients.filter(
      (p) => p.name.toLowerCase().includes(q) || p.phone.replace(/[^0-9]/g, "").includes(q.replace(/[^0-9]/g, ""))
    );
  }, [patients, query]);

  function handlePrintCard(p: Patient) {
    setPrintPatient(p);
    setTimeout(() => {
      window.print();
      setTimeout(() => setPrintPatient(null), 400);
    }, 300);
  }

  function handleEdit(p: Patient) {
    setEditingPatient(p);
    setShowForm(true);
    onSelectPatient(null);
  }

  function handleNewPatient() {
    setEditingPatient(null);
    setShowForm(true);
  }

  return (
    <div>
      {printPatient && <MedicalCardPrint patient={printPatient} />}

      <button type="button" onClick={handleNewPatient}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-bold text-white shadow-md shadow-teal-200 transition hover:bg-teal-700 active:scale-[0.98]"
        style={{ fontFamily: "'Cairo', sans-serif" }}>
        <UserPlus className="h-4 w-4" strokeWidth={2.4} />
        تسجيل مريض جديد
      </button>

      {showForm && (
        <PatientForm
          editing={editingPatient}
          onAdd={async (p) => { await onAddPatient(p); setShowForm(false); setEditingPatient(null); }}
          onUpdate={async (id, p) => { await onUpdatePatient(id, p); setShowForm(false); setEditingPatient(null); }}
          onCancel={() => { setShowForm(false); setEditingPatient(null); }}
        />
      )}

      {selectedPatient ? (
        <PatientProfile patient={selectedPatient} onBack={() => onSelectPatient(null)} onPrintCard={handlePrintCard} onEdit={handleEdit} />
      ) : (
        <>
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بالاسم أو رقم الهاتف..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-10 pl-3 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
              style={{ fontFamily: "'Cairo', sans-serif" }} />
          </div>

          <div className="space-y-2">
            {filtered.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400" style={{ fontFamily: "'Cairo', sans-serif" }}>
                {patients.length === 0 ? "لا يوجد مرضى مسجلون بعد" : "لا توجد نتائج مطابقة"}
              </p>
            ) : (
              filtered.map((p) => (
                <div key={p.id} className="flex items-center gap-2">
                  <button type="button" onClick={() => onSelectPatient(p)}
                    className="flex flex-1 items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white p-3 text-right shadow-sm transition hover:border-teal-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-teal-500">
                    <div className="flex items-center gap-3">
                      {p.profileImage ? (
                        <img src={p.profileImage} alt={p.name} className="h-10 w-10 rounded-full object-cover" loading="lazy" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50">
                          <User className="h-5 w-5 text-teal-600" strokeWidth={2} />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: "'Cairo', sans-serif" }}>{p.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400" dir="ltr">{p.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-400">{p.visits?.length ?? 0} زيارة</span>
                      <ArrowRight className="h-4 w-4 text-slate-300 dark:text-slate-500" />
                    </div>
                  </button>
                  <button type="button" onClick={() => handleEdit(p)}
                    className="flex shrink-0 items-center gap-1 rounded-lg bg-teal-600 px-2.5 py-2.5 text-[10px] font-bold text-white shadow-sm transition hover:bg-teal-700"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                    title="تعديل بيانات المريض">
                    <Pencil className="h-3.5 w-3.5" />
                    تعديل
                  </button>
                  <button type="button" onClick={() => handlePrintCard(p)}
                    className="flex shrink-0 items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-2.5 text-[10px] font-bold text-white shadow-sm transition hover:bg-blue-700"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                    title="طباعة كارت المتابعة">
                    <Printer className="h-3.5 w-3.5" />
                    كارت
                  </button>
                  <a href={whatsappShareUrl(p.phone, sharePatientCardSummary(p, clinicConfig.doctorName, "ar"))} target="_blank" rel="noopener noreferrer"
                    className="flex shrink-0 items-center gap-1 rounded-lg bg-[#25D366] px-2.5 py-2.5 text-[10px] font-bold text-white shadow-sm transition hover:brightness-110"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                    title="مشاركة واتساب">
                    <MessageCircle className="h-3.5 w-3.5" />
                  </a>
                  <a href={emailShareUrl("كارت المتابعة الطبية", sharePatientCardSummary(p, clinicConfig.doctorName, "ar"))}
                    className="flex shrink-0 items-center gap-1 rounded-lg bg-slate-600 px-2.5 py-2.5 text-[10px] font-bold text-white shadow-sm transition hover:bg-slate-700"
                    style={{ fontFamily: "'Cairo', sans-serif" }}
                    title="مشاركة إيميل">
                    <Mail className="h-3.5 w-3.5" />
                  </a>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

function PatientForm({
  editing, onAdd, onUpdate, onCancel,
}: {
  editing: Patient | null;
  onAdd: (p: PatientFormData) => Promise<void>;
  onUpdate: (id: string, p: PatientFormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [drugAllergies, setDrugAllergies] = useState("");
  const [chronicDiseases, setChronicDiseases] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [imgLoading, setImgLoading] = useState(false);
  const [attLoading, setAttLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const attInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setName(editing.name || "");
      setPhone(editing.phone || "");
      setAge(editing.age || "");
      setHeight(editing.height || "");
      setWeight(editing.weight || "");
      setBloodType(editing.bloodType || "");
      setBloodPressure(editing.bloodPressure || "");
      setDrugAllergies(editing.drugAllergies || "");
      setChronicDiseases(editing.chronicDiseases || "");
      setProfileImage(editing.profileImage || "");
      setAttachments(editing.attachments || []);
    }
  }, [editing]);

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgLoading(true); setError(null);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      setProfileImage(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر معالجة الصورة");
    } finally { setImgLoading(false); }
  }

  async function handleAttachments(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setAttLoading(true); setError(null);
    try {
      const atts = await filesToAttachments(files);
      setAttachments((prev) => [...prev, ...atts]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر معالجة الملفات");
    } finally { setAttLoading(false); }
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !phone) return;
    setSaving(true); setError(null);
    try {
      const formData: PatientFormData = {
        name, phone, age, height, weight, bloodType, bloodPressure,
        drugAllergies, chronicDiseases, profileImage, attachments,
      };
      if (editing) {
        await onUpdate(editing.id, formData);
      } else {
        await onAdd(formData);
      }
      setName(""); setPhone(""); setAge(""); setHeight(""); setWeight("");
      setBloodType(""); setBloodPressure(""); setDrugAllergies(""); setChronicDiseases("");
      setProfileImage(""); setAttachments([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل الحفظ");
    } finally { setSaving(false); }
  }

  return (
    <form onSubmit={submit} className="mb-4 rounded-2xl border border-teal-200 bg-teal-50/40 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-teal-700" style={{ fontFamily: "'Cairo', sans-serif" }}>
          {editing ? "تعديل بيانات المريض" : "تسجيل مريض جديد"}
        </h3>
        <button type="button" onClick={onCancel}
          className="inline-flex items-center gap-1 rounded-lg bg-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-600 transition hover:bg-slate-300"
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          <X className="h-3 w-3" /> إلغاء
        </button>
      </div>

      <div className="space-y-3.5">
        <div className="flex flex-col items-center">
          <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>صورة المريض</label>
          <div className="flex flex-col items-center gap-2">
            {profileImage ? (
              <img src={profileImage} alt="profile" className="h-20 w-20 rounded-full object-cover ring-2 ring-teal-400" loading="lazy" />
            ) : (
              <button type="button" onClick={() => imgInputRef.current?.click()}
                className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-teal-300 bg-white text-teal-500 transition hover:bg-teal-50">
                {imgLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-7 w-7" />}
              </button>
            )}
            <button type="button" onClick={() => imgInputRef.current?.click()}
              className="text-[11px] font-bold text-teal-600 underline" style={{ fontFamily: "'Cairo', sans-serif" }}>
              {profileImage ? "تغيير الصورة" : "رفع / التقاط صورة"}
            </button>
            <input ref={imgInputRef} type="file" accept="image/*" capture="user" onChange={handleImage} className="hidden" />
          </div>
        </div>

        <div>
          <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>اسم المريض</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="الاسم الكامل الرباعي" className="input" style={{ fontFamily: "'Cairo', sans-serif" }} />
        </div>

        <div>
          <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>رقم الهاتف</label>
          <input type="tel" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="01xxxxxxxxx" className="input text-left" />
        </div>

        <div>
          <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>السن</label>
          <input type="text" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} placeholder="مثال: 45" className="input" style={{ fontFamily: "'Cairo', sans-serif" }} />
        </div>

        <div>
          <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>الطول (سم)</label>
          <div className="relative">
            <Ruler className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="text" inputMode="numeric" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="مثال: 175" className="input pr-10" style={{ fontFamily: "'Cairo', sans-serif" }} />
          </div>
        </div>

        <div>
          <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>الوزن (كجم)</label>
          <div className="relative">
            <Weight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="text" inputMode="numeric" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="مثال: 80" className="input pr-10" style={{ fontFamily: "'Cairo', sans-serif" }} />
          </div>
        </div>

        <div>
          <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>فصيلة الدم</label>
          <div className="relative">
            <Droplet className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select value={bloodType} onChange={(e) => setBloodType(e.target.value)} className="input pr-10" style={{ fontFamily: "'Cairo', sans-serif" }}>
              <option value="">— اختر —</option>
              {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((bt) => <option key={bt} value={bt}>{bt}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>قياس الضغط</label>
          <div className="relative">
            <HeartPulse className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="text" value={bloodPressure} onChange={(e) => setBloodPressure(e.target.value)} placeholder="مثال: 120/80" className="input pr-10" dir="ltr" />
          </div>
        </div>

        <div>
          <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>الحساسية من الأدوية</label>
          <div className="relative">
            <AlertTriangle className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-400" />
            <input type="text" value={drugAllergies} onChange={(e) => setDrugAllergies(e.target.value)} placeholder="مثال: بنسلين، أسبرين" className="input pr-10" style={{ fontFamily: "'Cairo', sans-serif" }} />
          </div>
        </div>

        <div>
          <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>أمراض مزمنة / ملاحظات</label>
          <div className="relative">
            <Heart className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-rose-400" />
            <textarea value={chronicDiseases} onChange={(e) => setChronicDiseases(e.target.value)} rows={2} placeholder="مثال: سكري، ضغط مرتفع..." className="input resize-none pr-10" style={{ fontFamily: "'Cairo', sans-serif" }} />
          </div>
        </div>

        <div>
          <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>إضافة أشعة / تحاليل / روشتات سابقة</label>
          <button type="button" onClick={() => attInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/50 py-2.5 text-xs font-bold text-blue-600 transition hover:bg-blue-50"
            style={{ fontFamily: "'Cairo', sans-serif" }}>
            {attLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
            {attLoading ? "جارٍ المعالجة..." : "إرفاق ملفات طبية"}
          </button>
          <input ref={attInputRef} type="file" multiple accept="image/*,application/pdf" onChange={handleAttachments} className="hidden" />
          {attachments.length > 0 && (
            <div className="mt-2 space-y-1.5">
              {attachments.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-white px-2.5 py-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <FileText className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                    <span className="truncate text-[11px] text-slate-600">{a.name}</span>
                  </div>
                  <button type="button" onClick={() => removeAttachment(a.id)} className="shrink-0 rounded p-0.5 text-red-500 hover:bg-red-50">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700">
            <AlertTriangle className="h-4 w-4 shrink-0" />{error}
          </div>
        )}

        <button type="submit" disabled={saving || !name || !phone}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-teal-700 active:scale-[0.98] disabled:opacity-50"
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editing ? <Pencil className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
          {saving ? "جارٍ الحفظ..." : editing ? "تحديث الملف الطبي" : "حفظ الملف الطبي"}
        </button>
      </div>
    </form>
  );
}

function PatientProfile({ patient, onBack, onPrintCard, onEdit }: { patient: Patient; onBack: () => void; onPrintCard: (p: Patient) => void; onEdit: (p: Patient) => void }) {
  const sortedVisits = [...(patient.visits ?? [])].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={onBack}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 transition hover:text-teal-600"
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          <X className="h-3.5 w-3.5" /> رجوع لقائمة المرضى
        </button>
        <div className="flex gap-2">
          <button type="button" onClick={() => onEdit(patient)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-teal-700"
            style={{ fontFamily: "'Cairo', sans-serif" }}>
            <Pencil className="h-3.5 w-3.5" /> تعديل
          </button>
          <button type="button" onClick={() => onPrintCard(patient)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
            style={{ fontFamily: "'Cairo', sans-serif" }}>
            <Printer className="h-3.5 w-3.5" /> طباعة كارت المتابعة
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-teal-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-teal-700 to-blue-800 px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            {patient.profileImage ? (
              <img src={patient.profileImage} alt={patient.name} className="h-12 w-12 rounded-full object-cover ring-2 ring-white/25" loading="lazy" />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 ring-2 ring-white/25">
                <User className="h-6 w-6" strokeWidth={1.8} />
              </div>
            )}
            <div>
              <p className="text-base font-extrabold" style={{ fontFamily: "'Cairo', sans-serif" }}>{patient.name}</p>
              <div className="flex items-center gap-3 text-xs text-teal-100">
                <span dir="ltr"><Phone className="inline h-3 w-3" /> {patient.phone}</span>
                <span style={{ fontFamily: "'Cairo', sans-serif" }}>السن: {patient.age || "—"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 border-b border-slate-100 px-5 py-3">
          {patient.bloodType && <VitalChip icon={<Droplet className="h-3 w-3" />} label="فصيلة الدم" value={patient.bloodType} />}
          {patient.bloodPressure && <VitalChip icon={<HeartPulse className="h-3 w-3" />} label="الضغط" value={patient.bloodPressure} />}
          {patient.height && <VitalChip icon={<Ruler className="h-3 w-3" />} label="الطول" value={patient.height + " سم"} />}
          {patient.weight && <VitalChip icon={<Weight className="h-3 w-3" />} label="الوزن" value={patient.weight + " كجم"} />}
        </div>

        {patient.drugAllergies && (
          <div className="flex items-start gap-2 border-b border-slate-100 bg-rose-50/50 px-5 py-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
            <div>
              <p className="text-[11px] font-bold text-rose-600" style={{ fontFamily: "'Cairo', sans-serif" }}>الحساسية من الأدوية</p>
              <p className="text-xs text-rose-700" style={{ fontFamily: "'Cairo', sans-serif" }}>{patient.drugAllergies}</p>
            </div>
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

        {patient.attachments && patient.attachments.length > 0 && (
          <div className="border-b border-slate-100 px-5 py-3">
            <p className="mb-2 text-[11px] font-bold text-slate-400" style={{ fontFamily: "'Cairo', sans-serif" }}>المرفقات الطبية ({patient.attachments.length})</p>
            <div className="flex flex-wrap gap-2">
              {patient.attachments.map((a) => (
                <a key={a.id} href={a.dataUrl} download={a.name} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-100 bg-slate-50 px-2 py-1 text-[10px] text-slate-600 transition hover:bg-slate-100">
                  <FileText className="h-3 w-3 text-blue-500" />
                  <span className="max-w-[120px] truncate">{a.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="px-5 py-4">
          <div className="mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-teal-600" strokeWidth={2.2} />
            <h3 className="text-sm font-bold text-slate-800" style={{ fontFamily: "'Cairo', sans-serif" }}>سجل الزيارات ({sortedVisits.length})</h3>
          </div>
          {sortedVisits.length === 0 ? (
            <p className="py-3 text-center text-xs text-slate-400" style={{ fontFamily: "'Cairo', sans-serif" }}>لا توجد زيارات مسجلة</p>
          ) : (
            <div className="space-y-3">
              {sortedVisits.map((visit) => (
                <div key={visit.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                  <p className="text-xs font-bold text-slate-700" style={{ fontFamily: "'Cairo', sans-serif" }}>{formatDateAr(visit.date)}</p>
                  {visit.diagnosis && <p className="mt-1 text-xs text-slate-600" style={{ fontFamily: "'Cairo', sans-serif" }}><span className="font-bold">التشخيص: </span>{visit.diagnosis}</p>}
                  {visit.medications && visit.medications.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {visit.medications.map((m) => (
                        <li key={m.id} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                          <FileText className="mt-0.5 h-3 w-3 shrink-0 text-teal-500" />
                          <span><span className="font-bold" dir="ltr">{m.drugName}</span> — {m.dosage}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {visit.nextConsultDate && (
                    <p className="mt-1.5 text-[10px] font-bold text-emerald-600" style={{ fontFamily: "'Cairo', sans-serif" }}>
                      الاستشارة القادمة: {formatDateAr(visit.nextConsultDate)} {visit.nextConsultTime}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="mt-3 text-center text-[10px] text-slate-400" style={{ fontFamily: "'Cairo', sans-serif" }}>
        انتقل لتبويب "الروشتة" لكتابة روشتة جديدة لهذا المريض
      </p>
    </div>
  );
}

function VitalChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5">
      <span className="text-teal-600">{icon}</span>
      <span className="text-[10px] font-bold text-slate-500" style={{ fontFamily: "'Cairo', sans-serif" }}>{label}:</span>
      <span className="text-[11px] font-bold text-slate-700" dir="ltr">{value}</span>
    </div>
  );
}

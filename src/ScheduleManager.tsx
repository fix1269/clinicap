import { useEffect, useState } from "react";
import { Plus, Trash2, Save, AlertCircle, CheckCircle2, Loader2, Clock, Phone, MapPin, Stethoscope, Megaphone } from "lucide-react";
import type { DaySchedule, Shift, ShiftStatus } from "./types";
import { clinicConfig } from "./firebase-config";
import { defaultForId, newUid } from "./defaults";

interface Props {
  schedule: DaySchedule[];
  onUpdate: (day: DaySchedule) => Promise<void>;
}

function emptyShift(): Shift {
  return { id: newUid(), clinicName: "", address: "", fromTime: "09:00", toTime: "13:00", status: "غير متواجد", alertMessage: "", phone: "+201000000000" };
}

export default function ScheduleManager({ schedule, onUpdate }: Props) {
  const [selectedId, setSelectedId] = useState<string>(clinicConfig.days[0].id);
  const [day, setDay] = useState<DaySchedule>(defaultForId(clinicConfig.days[0].id));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const existing = schedule.find((d) => d.id === selectedId);
    setDay(existing ? JSON.parse(JSON.stringify(existing)) : defaultForId(selectedId));
    setSaved(false); setError(null);
  }, [selectedId, schedule]);

  function updateShift(idx: number, patch: Partial<Shift>) {
    setDay((prev) => {
      const shifts = [...prev.shifts];
      shifts[idx] = { ...shifts[idx], ...patch };
      return { ...prev, shifts };
    });
  }
  function addShift() { setDay((prev) => ({ ...prev, shifts: [...prev.shifts, emptyShift()] })); }
  function removeShift(idx: number) { setDay((prev) => ({ ...prev, shifts: prev.shifts.filter((_, i) => i !== idx) })); }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setSaved(false); setError(null);
    try {
      await onUpdate(day);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) { setError(err instanceof Error ? err.message : "فشل التحديث"); }
    finally { setSaving(false); }
  }

  return (
    <div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>اختر اليوم</label>
        <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          {clinicConfig.days.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
        </select>
      </div>

      <form onSubmit={handleSave} className="mt-4 space-y-3">
        {day.shifts.map((shift, idx) => (
          <div key={shift.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-md bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-700" style={{ fontFamily: "'Cairo', sans-serif" }}>فترة {idx + 1}</span>
              <button type="button" onClick={() => removeShift(idx)}
                className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600 transition hover:bg-red-100"
                style={{ fontFamily: "'Cairo', sans-serif" }}>
                <Trash2 className="h-3 w-3" /> حذف الفترة
              </button>
            </div>
            <div className="space-y-3.5">
              <div>
                <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>اسم العيادة / الفرع</label>
                <div className="relative">
                  <Stethoscope className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="text" value={shift.clinicName} onChange={(e) => updateShift(idx, { clinicName: e.target.value })}
                    placeholder="مثال: عيادة المعادي" className="input pr-10" style={{ fontFamily: "'Cairo', sans-serif" }} />
                </div>
              </div>
              <div>
                <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>العنوان التفصيلي</label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="text" value={shift.address} onChange={(e) => updateShift(idx, { address: e.target.value })}
                    placeholder="مثال: شارع 9، المعادي، القاهرة" className="input pr-10" style={{ fontFamily: "'Cairo', sans-serif" }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>من الساعة</label>
                  <div className="relative">
                    <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input type="time" dir="ltr" value={shift.fromTime} onChange={(e) => updateShift(idx, { fromTime: e.target.value })} className="input pl-10 text-center" />
                  </div>
                </div>
                <div>
                  <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>إلى الساعة</label>
                  <div className="relative">
                    <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input type="time" dir="ltr" value={shift.toTime} onChange={(e) => updateShift(idx, { toTime: e.target.value })} className="input pl-10 text-center" />
                  </div>
                </div>
              </div>
              <div>
                <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>الحالة</label>
                <div className="grid grid-cols-3 gap-2">
                  {clinicConfig.statusOptions.map((opt) => {
                    const active = shift.status === opt.value;
                    return (
                      <button type="button" key={opt.value} onClick={() => updateShift(idx, { status: opt.value as ShiftStatus })}
                        className={`rounded-xl border-2 px-2 py-2.5 text-xs font-bold transition ${
                          active
                            ? opt.value === "متواجد حالياً" ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : opt.value === "إجازة" ? "border-amber-500 bg-amber-50 text-amber-700"
                            : "border-slate-400 bg-slate-50 text-slate-700"
                            : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                        }`}
                        style={{ fontFamily: "'Cairo', sans-serif" }}>{opt.label}</button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>رقم واتساب للحجز</label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input type="tel" dir="ltr" value={shift.phone} onChange={(e) => updateShift(idx, { phone: e.target.value })}
                    placeholder="+201001234567" className="input pl-10 text-left" />
                </div>
              </div>
              <div>
                <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>إعلان عاجل (اختياري)</label>
                <div className="relative">
                  <Megaphone className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400" />
                  <textarea value={shift.alertMessage} onChange={(e) => updateShift(idx, { alertMessage: e.target.value })}
                    rows={2} placeholder="مثال: الدكتور متأخر ساعة اليوم" className="input resize-none pr-10" style={{ fontFamily: "'Cairo', sans-serif" }} />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button type="button" onClick={addShift}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-teal-300 py-3 text-sm font-bold text-teal-600 transition hover:bg-teal-50"
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          <Plus className="h-4 w-4" strokeWidth={2.4} /> إضافة فترة جديدة
        </button>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />{error}
          </div>
        )}
        {saved && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-bold text-emerald-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" /> تم التحديث والمزامنة بنجاح
          </div>
        )}

        <button type="submit" disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-bold text-white shadow-lg shadow-teal-200 transition-all hover:bg-teal-700 active:scale-[0.98] disabled:opacity-60"
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" strokeWidth={2.4} />}
          {saving ? "جارٍ التحديث..." : "تحديث ومزامنة"}
        </button>
      </form>
    </div>
  );
}

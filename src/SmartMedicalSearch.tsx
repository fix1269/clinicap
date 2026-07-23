import { useState } from "react";
import { Search, MapPin, FlaskConical, ScanLine, Pill, Building, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { mapsSearchUrl } from "./links";

interface QuickButton {
  label: string;
  query: string;
  icon: React.ReactNode;
  color: string;
}

const quickButtons: QuickButton[] = [
  { label: "أقرب معمل تحاليل", query: "معمل تحاليل", icon: <FlaskConical className="h-4 w-4" />, color: "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100" },
  { label: "أقرب مركز أشعة", query: "مركز أشعة وسونار", icon: <ScanLine className="h-4 w-4" />, color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" },
  { label: "أقرب صيدلية", query: "صيدلية", icon: <Pill className="h-4 w-4" />, color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" },
  { label: "أقرب مستشفى", query: "مستشفى", icon: <Building className="h-4 w-4" />, color: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100" },
  { label: "أقرب تأمين صحي", query: "هيئة التأمين الصحي", icon: <ShieldCheck className="h-4 w-4" />, color: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" },
];

export default function SmartMedicalSearch() {
  const [customQuery, setCustomQuery] = useState("");
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  function requestLocation(): Promise<{ lat: number; lng: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setGeoError("المتصفح لا يدعم تحديد الموقع");
        resolve(null);
        return;
      }
      setLocating(true);
      setGeoError(null);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCoords(c);
          setLocating(false);
          resolve(c);
        },
        (err) => {
          let msg = "تعذر تحديد الموقع";
          if (err.code === err.PERMISSION_DENIED) msg = "تم رفض إذن الوصول للموقع. يرجى السماح به وإعادة المحاولة.";
          else if (err.code === err.TIMEOUT) msg = "انتهى وقت تحديد الموقع. حاول مرة أخرى.";
          setGeoError(msg);
          setLocating(false);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }

  async function handleQuickSearch(query: string) {
    const c = await requestLocation();
    const url = c ? mapsSearchUrl(query, c.lat, c.lng) : mapsSearchUrl(query);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function handleCustomSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!customQuery.trim()) return;
    await handleQuickSearch(customQuery.trim());
  }

  return (
    <div>
      <form onSubmit={handleCustomSearch} className="mb-4">
        <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>بحث مخصص</label>
        <div className="relative">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type="text" value={customQuery} onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="اكتب اسم الخدمة أو المكان الطبي..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-10 pl-3 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
            style={{ fontFamily: "'Cairo', sans-serif" }} />
        </div>
        <button type="submit" disabled={locating}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-2.5 text-sm font-bold text-white shadow-md shadow-teal-200 transition hover:bg-teal-700 active:scale-[0.98] disabled:opacity-60"
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" strokeWidth={2.4} />}
          {locating ? "جارٍ تحديد الموقع..." : "بحث حول موقعي"}
        </button>
      </form>

      {geoError && (
        <div className="mb-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs font-medium text-amber-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span style={{ fontFamily: "'Cairo', sans-serif" }}>{geoError}</span>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-[11px] font-bold text-slate-400" style={{ fontFamily: "'Cairo', sans-serif" }}>بحث سريع بالخدمة:</p>
        {quickButtons.map((btn) => (
          <button key={btn.label} type="button" onClick={() => handleQuickSearch(btn.query)} disabled={locating}
            className={`flex w-full items-center gap-2.5 rounded-xl border px-3.5 py-3 text-sm font-bold transition active:scale-[0.98] disabled:opacity-60 ${btn.color}`}
            style={{ fontFamily: "'Cairo', sans-serif" }}>
            {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : btn.icon}
            <span>{btn.label}</span>
          </button>
        ))}
      </div>

      {coords && !geoError && (
        <p className="mt-3 text-center text-[10px] text-emerald-600" style={{ fontFamily: "'Cairo', sans-serif" }}>
          تم تحديد موقعك — سيتم البحث حول إحداثياتك الحالية
        </p>
      )}
    </div>
  );
}

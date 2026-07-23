import { useState, useEffect } from "react";
import { Crown, Save, Loader2, CheckCircle2 } from "lucide-react";
import type { VipSettings } from "./marketing";
import type { Lang } from "./useLang";
import { tr } from "./i18n";

interface Props {
  vip: VipSettings;
  lang: Lang;
  onSave: (v: VipSettings) => Promise<void>;
}

export default function VipAdmin({ vip, lang, onSave }: Props) {
  const [discount, setDiscount] = useState(vip.discountPercent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => setDiscount(vip.discountPercent), [vip.discountPercent]);

  async function save() {
    setSaving(true);
    try {
      await onSave({ discountPercent: discount });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 dark:border-amber-800/40 dark:bg-slate-800">
      <div className="mb-3 flex items-center gap-2">
        <Crown className="h-4 w-4 text-amber-500" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("vipGlobalDiscount", lang)}</h3>
      </div>
      <div className="flex items-center gap-2">
        <input value={discount} onChange={(e) => setDiscount(e.target.value)} inputMode="numeric" dir="ltr"
          className="input w-24 text-center" placeholder="10" />
        <span className="text-lg font-bold text-amber-600">%</span>
        <button type="button" onClick={save} disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-amber-600 disabled:opacity-50"
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {tr("saveSettings", lang)}
        </button>
      </div>
      {saved && (
        <div className="mt-2 flex items-center gap-2 text-xs font-bold text-emerald-600">
          <CheckCircle2 className="h-4 w-4" /> {tr("settingsSaved", lang)}
        </div>
      )}
    </div>
  );
}

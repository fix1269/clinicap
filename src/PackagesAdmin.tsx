import { useState } from "react";
import { Plus, Trash2, Loader2, Tag, Power } from "lucide-react";
import type { Package } from "./marketing";
import type { Lang } from "./useLang";
import { tr } from "./i18n";
import { newUid } from "./defaults";

interface Props {
  packages: Package[];
  lang: Lang;
  onAdd: (p: Package) => Promise<void>;
  onUpdate: (id: string, p: Partial<Package>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function PackagesAdmin({ packages, lang, onAdd, onUpdate, onDelete }: Props) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [services, setServices] = useState("");
  const [saving, setSaving] = useState(false);

  async function add() {
    if (!name) return;
    setSaving(true);
    try {
      await onAdd({
        id: newUid(), name, price, discount, services, active: true,
        createdAt: new Date().toISOString(),
      });
      setName(""); setPrice(""); setDiscount(""); setServices("");
    } finally { setSaving(false); }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-teal-200 bg-teal-50/40 p-4 dark:border-teal-800/40 dark:bg-slate-800">
        <h3 className="mb-3 text-sm font-bold text-teal-700 dark:text-teal-300" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("addPackage", lang)}</h3>
        <div className="space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={tr("packageName", lang)} className="input" style={{ fontFamily: "'Cairo', sans-serif" }} />
          <div className="grid grid-cols-2 gap-3">
            <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="numeric" placeholder={tr("packagePrice", lang)} className="input" dir="ltr" />
            <input value={discount} onChange={(e) => setDiscount(e.target.value)} inputMode="numeric" placeholder={tr("packageDiscount", lang)} className="input" dir="ltr" />
          </div>
          <textarea value={services} onChange={(e) => setServices(e.target.value)} rows={3} placeholder={tr("packageServices", lang) + " (—)"} className="input resize-none" style={{ fontFamily: "'Cairo', sans-serif" }} />
          <button type="button" onClick={add} disabled={saving || !name}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-teal-700 disabled:opacity-50"
            style={{ fontFamily: "'Cairo', sans-serif" }}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {tr("addPackage", lang)}
          </button>
        </div>
      </div>

      {packages.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("noPackages", lang)}</p>
      ) : (
        packages.map((pkg) => (
          <div key={pkg.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: "'Cairo', sans-serif" }}>{pkg.name}</span>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${pkg.active ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"}`}>
                {pkg.active ? tr("activatePackage", lang) : tr("deactivatePackage", lang)}
              </span>
            </div>
            <div className="mb-3 flex gap-3 text-xs text-slate-500 dark:text-slate-400" dir="ltr">
              {pkg.price && <span>{pkg.price} ج.م</span>}
              {pkg.discount && <span className="text-rose-500">-{pkg.discount}%</span>}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => onUpdate(pkg.id, { active: !pkg.active })}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition ${pkg.active ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300"}`}
                style={{ fontFamily: "'Cairo', sans-serif" }}>
                <Power className="h-3.5 w-3.5" /> {pkg.active ? tr("deactivatePackage", lang) : tr("activatePackage", lang)}
              </button>
              <button type="button" onClick={() => onDelete(pkg.id)}
                className="flex items-center justify-center rounded-lg bg-red-50 px-3 py-2 text-red-600 transition hover:bg-red-100 dark:bg-red-900/20">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

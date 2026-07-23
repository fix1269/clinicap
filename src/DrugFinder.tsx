import { useMemo, useState } from "react";
import { Search, Pill, Tag } from "lucide-react";
import { drugs, type Drug } from "./drugs";

interface Props {
  compact?: boolean;
  onSelect?: (drug: Drug) => void;
  selectedBrand?: string | null;
}

function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase().trim();
  const t = text.toLowerCase();
  if (!q) return true;
  if (t.includes(q)) return true;
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

export default function DrugFinder({ compact, onSelect, selectedBrand }: Props) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    return drugs.filter(
      (d) =>
        fuzzyMatch(query, d.brand) ||
        fuzzyMatch(query, d.activeSubstance) ||
        fuzzyMatch(query, d.category)
    );
  }, [query]);

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث باسم الدواء أو المادة الفعالة..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-10 pl-3 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        />
      </div>

      <div className={`mt-3 space-y-2 ${compact ? "max-h-72 overflow-y-auto pr-1" : ""}`}>
        {results.length === 0 && (
          <p className="py-6 text-center text-sm text-slate-400" style={{ fontFamily: "'Cairo', sans-serif" }}>
            لا توجد نتائج مطابقة
          </p>
        )}
        {results.map((d) => {
          const isSelected = selectedBrand === d.brand;
          return (
            <div
              key={d.brand}
              className={`rounded-xl border bg-white p-3 transition ${
                isSelected ? "border-teal-500 ring-1 ring-teal-300" : "border-slate-100"
              } ${onSelect ? "cursor-pointer hover:border-teal-300" : ""}`}
              onClick={() => onSelect?.(d)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50">
                    <Pill className="h-4 w-4 text-teal-600" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800" dir="ltr" style={{ fontFamily: "'Cairo', sans-serif" }}>
                      {d.brand}
                    </p>
                    <p className="text-[11px] text-slate-500" dir="ltr">{d.activeSubstance}</p>
                  </div>
                </div>
                <div className="text-left">
                  <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-bold text-amber-700">
                    {d.priceEGP} ج.م
                  </span>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-1">
                <Tag className="h-3 w-3 text-slate-400" />
                <span className="text-[10px] text-slate-400" style={{ fontFamily: "'Cairo', sans-serif" }}>البدائل:</span>
                {d.alternatives.map((a) => (
                  <span key={a} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600" dir="ltr">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

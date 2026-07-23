import { Star, Check, X } from "lucide-react";
import type { Review } from "./marketing";
import type { Lang } from "./useLang";
import { tr } from "./i18n";

interface Props {
  reviews: Review[];
  lang: Lang;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

export default function ReviewsAdmin({ reviews, lang, onApprove, onReject }: Props) {
  const pending = reviews.filter((r) => !r.approved);
  const approved = reviews.filter((r) => r.approved);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-amber-700 dark:text-amber-300" style={{ fontFamily: "'Cairo', sans-serif" }}>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] dark:bg-amber-900/30">{pending.length}</span>
          {tr("pendingReviews", lang)}
        </h3>
        {pending.length === 0 ? (
          <p className="py-3 text-center text-xs text-slate-400" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("noReviews", lang)}</p>
        ) : (
          <div className="space-y-2">
            {pending.map((r) => <ReviewRow key={r.id} r={r} lang={lang} onApprove={onApprove} onReject={onReject} />)}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300" style={{ fontFamily: "'Cairo', sans-serif" }}>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] dark:bg-emerald-900/30">{approved.length}</span>
          {tr("approvedReviews", lang)}
        </h3>
        {approved.length === 0 ? (
          <p className="py-3 text-center text-xs text-slate-400" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("noReviews", lang)}</p>
        ) : (
          <div className="space-y-2">
            {approved.map((r) => <ReviewRow key={r.id} r={r} lang={lang} onApprove={onApprove} onReject={onReject} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewRow({ r, lang, onApprove, onReject }: { r: Review; lang: Lang; onApprove: (id: string) => Promise<void>; onReject: (id: string) => Promise<void> }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: "'Cairo', sans-serif" }}>{r.name}</span>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"}`} />
          ))}
        </div>
      </div>
      <p className="mb-2 text-xs text-slate-600 dark:text-slate-300" style={{ fontFamily: "'Cairo', sans-serif" }}>{r.text}</p>
      <div className="flex gap-2">
        {!r.approved && (
          <button type="button" onClick={() => onApprove(r.id)}
            className="flex items-center gap-1 rounded-lg bg-emerald-100 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 transition hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300"
            style={{ fontFamily: "'Cairo', sans-serif" }}>
            <Check className="h-3 w-3" /> {tr("approve", lang)}
          </button>
        )}
        <button type="button" onClick={() => onReject(r.id)}
          className="flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-[11px] font-bold text-red-600 transition hover:bg-red-100 dark:bg-red-900/20"
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          <X className="h-3 w-3" /> {tr("reject", lang)}
        </button>
      </div>
    </div>
  );
}

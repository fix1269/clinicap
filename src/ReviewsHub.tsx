import { useState, useEffect, useRef } from "react";
import { Star, Quote, Send, CheckCircle2, MessageSquare } from "lucide-react";
import type { Review } from "./marketing";
import type { Lang } from "./useLang";
import { tr } from "./i18n";
import { db, initialized } from "./firebase";
import { clinicConfig } from "./firebase-config";
import { collection, addDoc } from "firebase/firestore";

interface Props {
  reviews: Review[];
  lang: Lang;
}

export default function ReviewsHub({ reviews, lang }: Props) {
  const approved = reviews.filter((r) => r.approved);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (approved.length <= 1) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % approved.length), 4500);
    return () => clearInterval(id);
  }, [approved.length]);

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center gap-2">
        <Quote className="h-5 w-5 text-blue-500" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("reviews", lang)}</h2>
      </div>

      {approved.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <MessageSquare className="mx-auto mb-2 h-8 w-8 text-slate-300" />
          <p className="text-sm text-slate-400" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("noReviews", lang)}</p>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-md dark:border-slate-700 dark:bg-slate-800">
          <div key={approved[idx]?.id} className="animate-[fadeIn_0.5s_ease] p-5">
            <Quote className="mb-3 h-7 w-7 text-blue-200" />
            <div className="mb-2 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < (approved[idx]?.rating ?? 5) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
              ))}
            </div>
            <p className="mb-4 text-sm leading-relaxed text-slate-700 dark:text-slate-200" style={{ fontFamily: "'Cairo', sans-serif" }}>
              "{approved[idx]?.text}"
            </p>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-blue-600 text-sm font-bold text-white">
                {approved[idx]?.name?.charAt(0) ?? "P"}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: "'Cairo', sans-serif" }}>{approved[idx]?.name}</p>
              </div>
            </div>
          </div>
          {approved.length > 1 && (
            <div className="flex justify-center gap-1.5 pb-3">
              {approved.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)} aria-label={`review ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${i === idx ? "w-6 bg-teal-600" : "w-2 bg-slate-300 dark:bg-slate-600"}`} />
              ))}
            </div>
          )}
        </div>
      )}

      <PatientReviewForm lang={lang} />
    </section>
  );
}

function PatientReviewForm({ lang }: { lang: Lang }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !text) return;
    if (!initialized || !db) { setError(tr("googleFailed", lang)); return; }
    setSubmitting(true); setError("");
    try {
      await addDoc(collection(db, clinicConfig.reviewsCollection), {
        name, rating, text, approved: false, createdAt: new Date().toISOString(),
      });
      setDone(true);
      setName(""); setText(""); setRating(5);
      setTimeout(() => setDone(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : tr("googleFailed", lang));
    } finally { setSubmitting(false); }
  }

  return (
    <form ref={formRef} onSubmit={submit} className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-200" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("writeReview", lang)}</h3>
      <div className="space-y-3">
        <input value={name} onChange={(e) => setName(e.target.value)} required
          placeholder={tr("yourName", lang)}
          className="input" style={{ fontFamily: "'Cairo', sans-serif" }} />
        <div>
          <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("yourRating", lang)}</label>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button key={i} type="button" onClick={() => setRating(i + 1)} onMouseEnter={() => setHover(i + 1)} onMouseLeave={() => setHover(0)}
                className="transition-transform active:scale-110">
                <Star className={`h-6 w-6 ${(hover || rating) > i ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"}`} />
              </button>
            ))}
          </div>
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} required rows={3}
          placeholder={tr("yourReview", lang)}
          className="input resize-none" style={{ fontFamily: "'Cairo', sans-serif" }} />
        {error && <p className="text-xs font-bold text-red-500">{error}</p>}
        {done && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" /> {tr("reviewPending", lang)}
          </div>
        )}
        <button type="submit" disabled={submitting || !name || !text}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          {submitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Send className="h-4 w-4" />}
          {tr("submitReview", lang)}
        </button>
      </div>
    </form>
  );
}

import { useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, googleProvider, db, initialized } from "./firebase";
import { clinicConfig } from "./firebase-config";
import type { Theme } from "./useTheme";
import type { Lang } from "./useLang";
import { tr } from "./i18n";
import ThemeLangToggles from "./ThemeLangToggles";

interface Props {
  onSuccess: () => void;
  expected: string;
  theme: Theme;
  toggleTheme: () => void;
  lang: Lang;
  toggleLang: () => void;
}

type ResetStage = "idle" | "google" | "verified" | "saving" | "saved" | "error";

export default function AdminLogin({ onSuccess, expected, theme, toggleTheme, lang, toggleLang }: Props) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState(false);
  const [resetStage, setResetStage] = useState<ResetStage>("idle");
  const [resetError, setResetError] = useState("");
  const [newPw, setNewPw] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === expected) onSuccess();
    else { setErr(true); setPw(""); }
  };

  async function handleGoogleRecover() {
    if (!initialized || !auth || !googleProvider) {
      setResetStage("error");
      setResetError(tr("googleFailed", lang));
      return;
    }
    setResetStage("google");
    setResetError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email ?? "";
      const allowed = clinicConfig.authorizedEmails.some(
        (e) => e.toLowerCase() === email.toLowerCase()
      );
      if (!allowed) {
        setResetStage("error");
        setResetError(tr("googleNotAuthorized", lang));
        return;
      }
      setResetStage("verified");
    } catch (e) {
      setResetStage("error");
      setResetError(e instanceof Error ? e.message : tr("googleFailed", lang));
    }
  }

  async function saveNewPassword() {
    if (!newPw || newPw.length < 3 || !db) {
      setResetError(lang === "ar" ? "كلمة المرور قصيرة جداً" : "Password too short");
      return;
    }
    setResetStage("saving");
    try {
      const ref = doc(db, "clinic_settings", clinicConfig.clinicConfigDoc);
      await setDoc(ref, { adminPassword: newPw }, { merge: true });
      setResetStage("saved");
    } catch (e) {
      setResetStage("error");
      setResetError(e instanceof Error ? e.message : tr("googleFailed", lang));
    }
  }

  const isDark = theme === "dark";

  return (
    <div className={`flex min-h-screen items-center justify-center px-4 ${isDark ? "bg-gradient-to-br from-slate-900 to-slate-800" : "bg-gradient-to-br from-slate-100 to-slate-200"}`}>
      <div className="absolute left-4 top-4">
        <ThemeLangToggles theme={theme} onToggleTheme={toggleTheme} lang={lang} onToggleLang={toggleLang} variant="admin" />
      </div>
      <div className="w-full max-w-sm">
        <div className={`overflow-hidden rounded-3xl border shadow-2xl ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"}`}>
          <div className="bg-gradient-to-br from-teal-700 to-blue-800 px-6 py-8 text-center text-white">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/15 ring-4 ring-white/20">
              <ShieldCheck className="h-7 w-7" strokeWidth={1.8} />
            </div>
            <h2 className="text-lg font-bold" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("doctorLogin", lang)}</h2>
            <p className="mt-1 text-xs text-teal-100" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("enterPassword", lang)}</p>
          </div>

          {resetStage === "verified" || resetStage === "saving" || resetStage === "saved" ? (
            <div className="space-y-4 p-6">
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-bold text-emerald-700">
                <CheckCircle2 className="h-4 w-4 shrink-0" /> {tr("passwordUpdated", lang).split(" ").slice(0, 2).join(" ")} ✓
              </div>
              <div>
                <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("newPassword", lang)}</label>
                <div className="relative">
                  <Lock className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark ? "text-slate-400" : "text-slate-400"}`} />
                  <input type={show ? "text" : "password"} value={newPw} autoFocus
                    onChange={(e) => setNewPw(e.target.value)}
                    className="input pl-10" style={{ fontFamily: "'Cairo', sans-serif" }} />
                </div>
              </div>
              <button type="button" onClick={saveNewPassword} disabled={resetStage === "saving"}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-bold text-white shadow-lg shadow-teal-200 transition-all hover:bg-teal-700 active:scale-[0.98] disabled:opacity-60"
                style={{ fontFamily: "'Cairo', sans-serif" }}>
                {resetStage === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                {tr("saveNewPassword", lang)}
              </button>
              {resetStage === "saved" && (
                <button type="button" onClick={onSuccess}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-800 active:scale-[0.98]"
                  style={{ fontFamily: "'Cairo', sans-serif" }}>
                  {tr("enterDashboard", lang)}
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4 p-6">
              <div>
                <label className="field-label" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("password", lang)}</label>
                <div className="relative">
                  <Lock className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${isDark ? "text-slate-400" : "text-slate-400"}`} />
                  <input type={show ? "text" : "password"} value={pw} autoFocus
                    onChange={(e) => { setPw(e.target.value); setErr(false); }}
                    className="input pl-10 pr-10" style={{ fontFamily: "'Cairo', sans-serif" }} />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {err && <p className="mt-2 text-xs font-bold text-red-500" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("wrongPassword", lang)}</p>}
              </div>
              <button type="submit" className="w-full rounded-xl bg-teal-600 py-3 text-sm font-bold text-white shadow-lg shadow-teal-200 transition-all hover:bg-teal-700 active:scale-[0.98]" style={{ fontFamily: "'Cairo', sans-serif" }}>
                {tr("login", lang)}
              </button>

              <div className="border-t border-slate-100 pt-3">
                <button type="button" onClick={handleGoogleRecover} disabled={resetStage === "google"}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
                  style={{ fontFamily: "'Cairo', sans-serif" }}>
                  {resetStage === "google" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />}
                  {resetStage === "google" ? tr("googleRecovering", lang) : tr("forgotGoogle", lang)}
                </button>
                {resetStage === "error" && resetError && (
                  <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-red-50 px-2.5 py-1.5 text-[11px] font-medium text-red-700">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {resetError}
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

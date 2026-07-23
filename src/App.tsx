import { useEffect, useState } from "react";
import {
  collection, doc, onSnapshot, setDoc, writeBatch, updateDoc, arrayUnion,
  deleteDoc,
} from "firebase/firestore";
import { db, initialized, initError, isConfigured } from "./firebase";
import { clinicConfig } from "./firebase-config";
import type { DaySchedule, Shift, Patient, Visit, PatientFormData } from "./types";
import { defaultSchedule, defaultForId, newUid } from "./defaults";
import PatientView from "./PatientView";
import AdminLogin from "./AdminLogin";
import AdminPanel from "./AdminPanel";
import { AlertTriangle, Database, Loader2, Lock } from "lucide-react";
import { useTheme } from "./useTheme";
import { useLang } from "./useLang";
import { tr } from "./i18n";
import { normalizePackage, normalizeReview, normalizeVip } from "./marketing";
import type { Package, Review, VipSettings } from "./marketing";

type View = "patient" | "login" | "admin";

function normalizeShift(data: Record<string, unknown>, id: string): Shift {
  return {
    id: (data.id as string) ?? id,
    clinicName: (data.clinicName as string) ?? "",
    address: (data.address as string) ?? "",
    fromTime: (data.fromTime as string) ?? "",
    toTime: (data.toTime as string) ?? "",
    status: (data.status as Shift["status"]) ?? "غير متواجد",
    alertMessage: (data.alertMessage as string) ?? "",
    phone: (data.phone as string) ?? "",
  };
}

function normalizePatient(data: Record<string, unknown>, id: string): Patient {
  return {
    id,
    name: (data.name as string) ?? "",
    phone: (data.phone as string) ?? "",
    age: (data.age as string) ?? "",
    height: (data.height as string) ?? "",
    weight: (data.weight as string) ?? "",
    bloodType: (data.bloodType as string) ?? "",
    bloodPressure: (data.bloodPressure as string) ?? "",
    drugAllergies: (data.drugAllergies as string) ?? "",
    chronicDiseases: (data.chronicDiseases as string) ?? "",
    profileImage: (data.profileImage as string) ?? "",
    attachments: (data.attachments as Patient["attachments"]) ?? [],
    visits: (data.visits as Visit[]) ?? [],
    createdAt: (data.createdAt as string) ?? "",
  };
}

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { lang, toggleLang } = useLang();
  const [view, setView] = useState<View>("patient");
  const [schedule, setSchedule] = useState<DaySchedule[]>(defaultSchedule());
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [connError, setConnError] = useState<string | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [vip, setVip] = useState<VipSettings>({ discountPercent: "10" });
  const [adminPassword, setAdminPassword] = useState(clinicConfig.adminPassword);

  useEffect(() => {
    if (!initialized || !db) {
      setLoading(false);
      if (!isConfigured()) setConnError("FIREBASE_NOT_CONFIGURED");
      else if (initError) setConnError(initError);
      return;
    }
    setLoading(true);
    const colRef = collection(db, clinicConfig.scheduleCollection);
    const unsubscribe = onSnapshot(colRef, (snap) => {
      if (snap.empty) { seedScheduleDefaults(); }
      else {
        const byId = new Map<string, DaySchedule>();
        snap.forEach((d: { data: () => Record<string, unknown>; id: string }) => {
          const data = d.data() as Record<string, unknown>;
          const id = d.id;
          const rawShifts = (data.shifts as Shift[] | undefined) ?? [];
          const shifts = rawShifts.map((s, i) => normalizeShift(s as unknown as Record<string, unknown>, `${id}-${i}`));
          byId.set(id, { id, day: (data.day as string) ?? id, shifts });
        });
        const ordered = clinicConfig.days.map((d) => byId.get(d.id) ?? defaultForId(d.id));
        setSchedule(ordered);
      }
      setLoading(false); setConnError(null);
    }, (err) => { setConnError(err.message); setLoading(false); });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!initialized || !db) { return; }
    const colRef = collection(db, clinicConfig.patientsCollection);
    const unsubscribe = onSnapshot(colRef, (snap) => {
      const list: Patient[] = [];
      snap.forEach((d: { data: () => Record<string, unknown>; id: string }) => list.push(normalizePatient(d.data(), d.id)));
      list.sort((a, b) => (a.name || "").localeCompare(b.name || "", "ar"));
      setPatients(list);
    }, () => { });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!initialized || !db) return;
    const unsub = onSnapshot(collection(db, clinicConfig.packagesCollection), (snap) => {
      const list: Package[] = [];
      snap.forEach((d: { data: () => Record<string, unknown>; id: string }) => list.push(normalizePackage(d.data(), d.id)));
      list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      setPackages(list);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!initialized || !db) return;
    const unsub = onSnapshot(collection(db, clinicConfig.reviewsCollection), (snap) => {
      const list: Review[] = [];
      snap.forEach((d: { data: () => Record<string, unknown>; id: string }) => list.push(normalizeReview(d.data(), d.id)));
      list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      setReviews(list);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!initialized || !db) return;
    const unsub = onSnapshot(doc(db, "clinic_settings", clinicConfig.clinicConfigDoc), (snap) => {
      if (snap.exists()) {
        const data = snap.data() as Record<string, unknown>;
        if (data.adminPassword) setAdminPassword(data.adminPassword as string);
        if (data.vipDiscount !== undefined) {
          setVip(normalizeVip({ discountPercent: data.vipDiscount as string }));
        }
      }
    });
    return () => unsub();
  }, []);

  async function seedScheduleDefaults() {
    if (!db) return;
    const database = db;
    try {
      const batch = writeBatch(database);
      defaultSchedule().forEach((row) => {
        const ref = doc(database, clinicConfig.scheduleCollection, row.id);
        const { id: _id, ...payload } = row;
        batch.set(ref, payload);
      });
      await batch.commit();
    } catch { /* non-fatal */ }
  }

  async function updateScheduleDay(row: DaySchedule) {
    if (!db) throw new Error(tr("dbNotConnected", lang));
    const ref = doc(db, clinicConfig.scheduleCollection, row.id);
    const { id: _id, ...payload } = row;
    await setDoc(ref, payload, { merge: true });
  }

  async function addPatient(p: PatientFormData) {
    if (!db) throw new Error(tr("dbNotConnected", lang));
    const id = newUid();
    const ref = doc(db, clinicConfig.patientsCollection, id);
    await setDoc(ref, { ...p, visits: [], createdAt: new Date().toISOString() });
  }

  async function updatePatient(id: string, p: PatientFormData) {
    if (!db) throw new Error(tr("dbNotConnected", lang));
    const ref = doc(db, clinicConfig.patientsCollection, id);
    await updateDoc(ref, { ...p });
  }

  async function syncVisit(patientId: string, visit: Visit) {
    if (!db) throw new Error(tr("dbNotConnected", lang));
    const ref = doc(db, clinicConfig.patientsCollection, patientId);
    await updateDoc(ref, { visits: arrayUnion(visit) });
  }

  async function addPackage(p: Package) {
    if (!db) throw new Error(tr("dbNotConnected", lang));
    const { id: _id, ...payload } = p;
    await setDoc(doc(db, clinicConfig.packagesCollection, p.id), payload);
  }
  async function updatePackage(id: string, patch: Partial<Package>) {
    if (!db) throw new Error(tr("dbNotConnected", lang));
    await updateDoc(doc(db, clinicConfig.packagesCollection, id), patch as Record<string, unknown>);
  }
  async function deletePackage(id: string) {
    if (!db) throw new Error(tr("dbNotConnected", lang));
    await deleteDoc(doc(db, clinicConfig.packagesCollection, id));
  }

  async function approveReview(id: string) {
    if (!db) throw new Error(tr("dbNotConnected", lang));
    await updateDoc(doc(db, clinicConfig.reviewsCollection, id), { approved: true });
  }
  async function rejectReview(id: string) {
    if (!db) throw new Error(tr("dbNotConnected", lang));
    await deleteDoc(doc(db, clinicConfig.reviewsCollection, id));
  }

  async function saveVip(v: VipSettings) {
    if (!db) throw new Error(tr("dbNotConnected", lang));
    await setDoc(doc(db, "clinic_settings", clinicConfig.clinicConfigDoc), { vipDiscount: v.discountPercent }, { merge: true });
  }

  function handleLogout() { setSelectedPatient(null); setView("patient"); }

  if (connError === "FIREBASE_NOT_CONFIGURED" || (!initialized && !isConfigured())) return <ConfigScreen lang={lang} />;

  if (connError && connError !== "FIREBASE_NOT_CONFIGURED") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center dark:bg-slate-900">
        <AlertTriangle className="h-10 w-10 text-amber-500" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("connectionError", lang)}</h2>
        <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("checkInternet", lang)}</p>
        <p className="text-xs text-slate-400">{connError}</p>
      </div>
    );
  }

  if (loading && view !== "admin" && view !== "login") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-300" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("loadingSchedule", lang)}</p>
      </div>
    );
  }

  if (view === "login") return <AdminLogin onSuccess={() => setView("admin")} expected={adminPassword} theme={theme} toggleTheme={toggleTheme} lang={lang} toggleLang={toggleLang} />;

  if (view === "admin") {
    return (
      <AdminPanel schedule={schedule} patients={patients} selectedPatient={selectedPatient} onSelectPatient={setSelectedPatient}
        onUpdateSchedule={updateScheduleDay} onAddPatient={addPatient} onUpdatePatient={updatePatient}
        onSyncVisit={syncVisit} onLogout={handleLogout}
        packages={packages} reviews={reviews} vip={vip}
        onAddPackage={addPackage} onUpdatePackage={updatePackage} onDeletePackage={deletePackage}
        onApproveReview={approveReview} onRejectReview={rejectReview}
        onSaveVip={saveVip}
        theme={theme} toggleTheme={toggleTheme} lang={lang} toggleLang={toggleLang}
      />
    );
  }

  return (
    <div className="relative">
      <PatientView schedule={schedule} doctorName={clinicConfig.doctorName} specialty={clinicConfig.specialty}
        packages={packages} reviews={reviews} vip={vip}
        theme={theme} toggleTheme={toggleTheme} lang={lang} toggleLang={toggleLang}
      />
      <footer className="border-t border-slate-100 bg-white py-5 text-center dark:border-slate-700 dark:bg-slate-900">
        <button onClick={() => setView("login")}
          className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-300 transition hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-300"
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          <Lock className="h-2.5 w-2.5" /> {tr("adminEntry", lang)}
        </button>
      </footer>
    </div>
  );
}

function ConfigScreen({ lang }: { lang: "ar" | "en" }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-b from-slate-50 to-white px-6 text-center dark:from-slate-900 dark:to-slate-800">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
        <Database className="h-8 w-8 text-amber-600" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: "'Cairo', sans-serif" }}>{tr("firebaseSetup", lang)}</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400" style={{ fontFamily: "'Cairo', sans-serif" }}>
          {lang === "ar" ? (
            <>افتح الملف <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-teal-700 dark:bg-slate-700 dark:text-teal-300">src/firebase-config.js</code> واستبدل القيم الافتراضية بمفاتيح مشروع Firebase الخاص بك.</>
          ) : (
            <>Open <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-teal-700 dark:bg-slate-700 dark:text-teal-300">src/firebase-config.js</code> and replace the default values with your Firebase project keys.</>
          )}
        </p>
      </div>
      <ol className="max-w-sm space-y-2 text-right text-xs text-slate-600 dark:text-slate-300" style={{ fontFamily: "'Cairo', sans-serif" }}>
        {lang === "ar" ? (
          <>
            <li>1. أنشئ مشروعاً على Firebase Console</li>
            <li>2. فعّل Firestore Database (وضع الاختبار)</li>
            <li>3. انسخ مفاتيح التطبيق من إعدادات المشروع</li>
            <li>4. الصقها في firebase-config.js ثم أعد التحميل</li>
          </>
        ) : (
          <>
            <li>1. Create a project on Firebase Console</li>
            <li>2. Enable Firestore Database (test mode)</li>
            <li>3. Copy the app keys from project settings</li>
            <li>4. Paste them in firebase-config.js then reload</li>
          </>
        )}
      </ol>
    </div>
  );
}

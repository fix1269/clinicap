// ============================================================
// White-Label Configuration — Egyptian Doctor's Clinic
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyCszKm6zntnSNbF9FCgT4XtXoABkEIIw6I",
  authDomain: "clinic-f-app.firebaseapp.com",
  projectId: "clinic-f-app",
  storageBucket: "clinic-f-app.firebasestorage.app",
  messagingSenderId: "445138538880",
  appId: "1:445138538880:web:6ec42d9c7037f94cd0b165",
  measurementId: "G-DFD5XB63CT"

};

export const clinicConfig = {
  doctorName: "د. مينا موريس",
  specialty: "استشاري أمراض الباطنة والجهاز الهضمي",
  adminPassword: "123",
  authorizedEmails: ["dr.mina.morris@gmail.com", "minamorris2015@gmail.com"],
  scheduleCollection: "schedule",
  patientsCollection: "patients",
  packagesCollection: "packages",
  reviewsCollection: "reviews_staging",
  vipCollection: "vip_settings",
  clinicConfigDoc: "clinic_config",
  days: [
    { id: "saturday", label: "السبت" },
    { id: "sunday", label: "الأحد" },
    { id: "monday", label: "الاثنين" },
    { id: "tuesday", label: "الثلاثاء" },
    { id: "wednesday", label: "الأربعاء" },
    { id: "thursday", label: "الخميس" },
    { id: "friday", label: "الجمعة" },
  ],
  statusOptions: [
    { value: "متواجد حالياً", label: "متواجد حالياً" },
    { value: "غير متواجد", label: "غير متواجد" },
    { value: "إجازة", label: "إجازة" },
  ],
};

export default firebaseConfig;

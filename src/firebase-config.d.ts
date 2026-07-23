declare const firebaseConfig: {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

export const clinicConfig: {
  doctorName: string;
  specialty: string;
  adminPassword: string;
  authorizedEmails: string[];
  scheduleCollection: string;
  patientsCollection: string;
  packagesCollection: string;
  reviewsCollection: string;
  vipCollection: string;
  clinicConfigDoc: string;
  days: { id: string; label: string }[];
  statusOptions: { value: string; label: string }[];
};

export default firebaseConfig;

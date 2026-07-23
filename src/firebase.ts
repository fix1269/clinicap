import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import firebaseConfig from "./firebase-config";

let db: ReturnType<typeof getFirestore> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let googleProvider: GoogleAuthProvider | null = null;
let initialized = false;
let initError: string | null = null;

function isConfigured(): boolean {
  return (
    !!firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== "YOUR_API_KEY" &&
    !!firebaseConfig.projectId &&
    firebaseConfig.projectId !== "YOUR_PROJECT_ID"
  );
}

try {
  if (isConfigured()) {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });
    initialized = true;
  } else {
    initError = "FIREBASE_NOT_CONFIGURED";
  }
} catch (e) {
  initError = e instanceof Error ? e.message : "FIREBASE_INIT_FAILED";
}

export { db, auth, googleProvider, initialized, initError, isConfigured };

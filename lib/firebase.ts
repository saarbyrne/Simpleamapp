import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '***REMOVED***',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '***REMOVED***',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '***REMOVED***',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '***REMOVED***.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '***REMOVED***',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:***REMOVED***:web:c14efb48186ba231166875',
};

// Lazy initialization - Firebase only initializes when these functions are called
// This reduces bundle size by ~500KB for users who never access chat features
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

/**
 * Get Firebase app instance (lazy initialization)
 * Only initializes Firebase when first called
 */
export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  }
  return app;
}

/**
 * Get Firebase Auth instance (lazy initialization)
 * Only initializes when chat/auth features are used
 */
export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

/**
 * Get Firebase Firestore instance (lazy initialization)
 * Only initializes when chat features are used
 */
export function getFirebaseDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}

export default getFirebaseApp;

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '***REMOVED***',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '***REMOVED***',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '***REMOVED***',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '***REMOVED***.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '***REMOVED***',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:***REMOVED***:web:c14efb48186ba231166875',
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Get Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

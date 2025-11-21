import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

/**
 * Initialize Firebase authentication for chat
 * For now uses anonymous auth, will be replaced with custom token auth later
 */
export async function initFirebaseAuth() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        resolve(user);
      } else {
        signInAnonymously(auth)
          .then(resolve)
          .catch(reject);
      }
    });
  });
}

/**
 * Get current Firebase user
 */
export function getCurrentFirebaseUser() {
  return auth.currentUser;
}

/**
 * Sign out from Firebase
 */
export async function signOutFirebase() {
  await auth.signOut();
}

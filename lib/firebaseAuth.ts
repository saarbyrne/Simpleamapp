import { signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from './firebase';

/**
 * Initialize Firebase authentication for chat using custom token
 * SECURITY: Uses Supabase-authenticated custom tokens with organization context
 */
export async function initFirebaseAuth() {
  try {
    // Get custom token from our backend
    const response = await fetch('/api/firebase-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get authentication token');
    }

    const { token } = await response.json();

    // Sign in with custom token
    const userCredential = await signInWithCustomToken(getFirebaseAuth(), token);
    return userCredential.user;
  } catch (error) {
    console.error('Firebase custom token authentication failed:', error);
    throw error;
  }
}

/**
 * Get current Firebase user
 */
export function getCurrentFirebaseUser() {
  return getFirebaseAuth().currentUser;
}

/**
 * Sign out from Firebase
 */
export async function signOutFirebase() {
  await getFirebaseAuth().signOut();
}

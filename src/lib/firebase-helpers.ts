
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { User } from '@/services/stories';
import { getAuth } from 'firebase-admin/auth';
import { initAdminApp } from './firebase-admin';
import { cookies } from 'next/headers';

// This is a server-side helper function to get the currently authenticated user.
// It's not a server action, so it doesn't need 'use server'.
export async function getAuthenticatedUser(): Promise<User | null> {
  // Ensure the admin app is initialized before proceeding.
  // This was a source of errors.
  await initAdminApp(); 
  const cookieStore = cookies();
  const token = cookieStore.get('firebaseIdToken')?.value;

  if (!token) {
    console.log("No firebaseIdToken cookie found.");
    return null;
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    const uid = decodedToken.uid;
    
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as User;
    }
    
    console.log(`User document not found for uid: ${uid}`);
    return null;
  } catch (error) {
    console.error("Error verifying token or fetching user:", error);
    // Token might be expired or invalid
    return null;
  }
}

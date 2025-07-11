
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { User } from '@/services/stories';

// This is a server-side helper function to get the currently authenticated user.
// It's not a server action, so it doesn't need 'use server'.
export async function getAuthenticatedUser(): Promise<User | null> {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) {
    return null;
  }

  const userDocRef = doc(db, 'users', firebaseUser.uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() } as User;
  }

  return null;
}

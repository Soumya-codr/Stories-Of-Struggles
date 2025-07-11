
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { User } from '@/services/stories';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setReloading(true);
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          Cookies.set('firebaseIdToken', token);
          
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUser({ id: userDoc.id, ...userDoc.data() } as User);
          } else {
            // User exists in Auth but not in Firestore, maybe during signup race condition
            // Or if doc creation failed. We should log them out to be safe.
            await signOut(auth); // This will trigger onAuthStateChanged again with null
            setUser(null);
            Cookies.remove('firebaseIdToken');
          }
        } catch (error) {
            console.error("Auth context error:", error);
            setUser(null);
            Cookies.remove('firebaseIdToken');
        }
      } else {
        // No firebase user, so we are logged out.
        setUser(null);
        Cookies.remove('firebaseIdToken');
      }
      setLoading(false);
      setReloading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signup = async (email: string, pass: string, name: string, username: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const firebaseUser = userCredential.user;
    
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    await setDoc(userDocRef, {
      name,
      username,
      email,
      avatarUrl: `https://placehold.co/128x128.png?text=${name.charAt(0)}`,
      bio: '',
      website: '',
      followers: 0,
      following: 0,
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = { user, loading: loading || reloading, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/types/memory';
import { auth, db } from '@/lib/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Try to load profile from Firestore
      const userDocRef = doc(db, 'users', fbUser.uid);
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        setUser(snap.data() as User);
      } else {
        const newUser: User = {
          id: fbUser.uid,
          email: fbUser.email || '',
          name: fbUser.displayName || '',
          createdAt: new Date().toISOString(),
          hasCompletedOnboarding: false,
        };
        await setDoc(userDocRef, newUser);
        setUser(newUser);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        setUser(snap.data() as User);
      }
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err?.message || 'Login failed' };
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      // Add profile to Firestore
      const newUser: User = {
        id: uid,
        email: email.toLowerCase(),
        name,
        createdAt: new Date().toISOString(),
        hasCompletedOnboarding: false,
      };
      await setDoc(doc(db, 'users', uid), newUser);

      // Update displayName on auth user
      try {
        await firebaseUpdateProfile(cred.user, { displayName: name });
      } catch (e) {
        // ignore
      }

      setUser(newUser);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err?.message || 'Signup failed' };
    }
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    try {
      await updateDoc(doc(db, 'users', user.id), updates as any);
    } catch (e) {
      // ignore write errors for now
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

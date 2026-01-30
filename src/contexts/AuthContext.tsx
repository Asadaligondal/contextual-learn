import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '@/types/memory';

// Demo auth (no Firebase) — allows any user to sign in with any email.
// This is intentionally permissive for demo/Vercel preview usage only.

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password?: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'learncontext_auth';
const USERS_KEY = 'learncontext_users';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Persist user to localStorage
  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const getUsers = useCallback((): Record<string, { user: User }> => {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : {};
  }, []);

  const saveUsers = useCallback((users: Record<string, { user: User }>) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, []);

  // Login: permissive demo — ignore password and allow any email.
  const login = async (email: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 200));

    const normalized = email.toLowerCase();
    const users = getUsers();

    if (users[normalized]) {
      setUser(users[normalized].user);
      setIsLoading(false);
      return { success: true };
    }

    // Create a lightweight user profile on first login
    const newUser: User = {
      id: (crypto as any).randomUUID ? (crypto as any).randomUUID() : String(Date.now()),
      email: normalized,
      name: normalized.split('@')[0] || 'Guest',
      createdAt: new Date().toISOString(),
      hasCompletedOnboarding: true,
    };

    users[normalized] = { user: newUser };
    saveUsers(users);
    setUser(newUser);
    setIsLoading(false);
    return { success: true };
  };

  // Signup: same as login for demo
  const signup = async (email: string, _password?: string, name?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 200));
    const normalized = email.toLowerCase();
    const users = getUsers();
    const newUser: User = {
      id: (crypto as any).randomUUID ? (crypto as any).randomUUID() : String(Date.now()),
      email: normalized,
      name: name || normalized.split('@')[0] || 'Guest',
      createdAt: new Date().toISOString(),
      hasCompletedOnboarding: true,
    };
    users[normalized] = { user: newUser };
    saveUsers(users);
    setUser(newUser);
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    const users = getUsers();
    if (users[user.email]) {
      users[user.email].user = updated;
      saveUsers(users);
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

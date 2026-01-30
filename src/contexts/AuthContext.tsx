import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '@/types/memory';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
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
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const getUsers = useCallback((): Record<string, { user: User; passwordHash: string }> => {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : {};
  }, []);

  const saveUsers = useCallback((users: Record<string, { user: User; passwordHash: string }>) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, []);

  // Simple hash for demo (not secure - for demo purposes only)
  const simpleHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getUsers();
    const userEntry = users[email.toLowerCase()];
    
    if (!userEntry) {
      setIsLoading(false);
      return { success: false, error: 'No account found with this email' };
    }
    
    if (userEntry.passwordHash !== simpleHash(password)) {
      setIsLoading(false);
      return { success: false, error: 'Incorrect password' };
    }
    
    setUser(userEntry.user);
    setIsLoading(false);
    return { success: true };
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getUsers();
    
    if (users[email.toLowerCase()]) {
      setIsLoading(false);
      return { success: false, error: 'An account with this email already exists' };
    }
    
    const newUser: User = {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      name,
      createdAt: new Date().toISOString(),
      hasCompletedOnboarding: false,
    };
    
    users[email.toLowerCase()] = {
      user: newUser,
      passwordHash: simpleHash(password),
    };
    
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
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    
    // Also update in users storage
    const users = getUsers();
    if (users[user.email]) {
      users[user.email].user = updatedUser;
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

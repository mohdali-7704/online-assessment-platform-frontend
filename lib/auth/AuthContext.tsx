'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { candidateService } from '@/lib/services/candidateService';

export type UserRole = 'admin' | 'candidate';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const foundCandidate = candidateService.getCandidateByUsername(username);

    if (foundCandidate && foundCandidate.password === password) {
      // Check if candidate is active
      if (foundCandidate.status !== 'active') {
        return false; // Inactive or suspended candidates cannot log in
      }

      const user: User = {
        id: foundCandidate.id,
        username: foundCandidate.username,
        name: `${foundCandidate.firstName} ${foundCandidate.lastName}`,
        email: foundCandidate.email,
        role: foundCandidate.role
      };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      // Update last login timestamp
      candidateService.updateLastLogin(foundCandidate.id);

      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isAdmin }}>
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

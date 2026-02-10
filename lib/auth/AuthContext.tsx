'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { backendClient } from '@/lib/api/backend-client';

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
  login: (username: string, password: string) => Promise<boolean>;
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

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await backendClient.post('/auth/login', {
        username,
        password
      });

      const candidateData = response.data;

      // Transform to User format
      const user: User = {
        id: candidateData.id,
        username: candidateData.username,
        name: `${candidateData.first_name} ${candidateData.last_name}`,
        email: candidateData.email,
        role: candidateData.role
      };

      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      return true;
    } catch (error: any) {
      console.error('Login failed:', error.response?.data?.detail || error.message);
      return false;
    }
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

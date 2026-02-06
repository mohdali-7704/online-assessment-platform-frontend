'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userService } from '@/lib/services/userService';

export type UserRole = 'admin' | 'user';

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
    const foundUser = userService.getUserByUsername(username);

    if (foundUser && foundUser.password === password) {
      // Check if user is active
      if (foundUser.status !== 'active') {
        return false; // Inactive or suspended users cannot log in
      }

      const user: User = {
        id: foundUser.id,
        username: foundUser.username,
        name: `${foundUser.firstName} ${foundUser.lastName}`,
        email: foundUser.email,
        role: foundUser.role
      };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      // Update last login timestamp
      userService.updateLastLogin(foundUser.id);

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

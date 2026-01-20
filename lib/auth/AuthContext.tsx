'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const MOCK_USERS = [
  {
    id: '1',
    username: 'john',
    password: 'john123',
    name: 'John Doe',
    email: 'john@example.com'
  },
  {
    id: '2',
    username: 'jane',
    password: 'jane123',
    name: 'Jane Smith',
    email: 'jane@example.com'
  },
  {
    id: '3',
    username: 'admin',
    password: 'admin123',
    name: 'Admin User',
    email: 'admin@example.com'
  }
];

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
    const foundUser = MOCK_USERS.find(
      u => u.username === username && u.password === password
    );

    if (foundUser) {
      const user: User = {
        id: foundUser.id,
        username: foundUser.username,
        name: foundUser.name,
        email: foundUser.email
      };
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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

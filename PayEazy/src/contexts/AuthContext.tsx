import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@eazypay.com',
    name: 'Platform Admin',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'agent@eazypay.com',
    name: 'John Agent',
    role: 'agent',
    createdAt: '2024-01-02T00:00:00Z',
    balance: 1250.50,
    commission: 125.05,
  },
  {
    id: '3',
    email: 'customer@eazypay.com',
    name: 'Jane Customer',
    role: 'customer',
    createdAt: '2024-01-03T00:00:00Z',
    balance: 500.00,
    totalDeposits: 1200.00,
    winnings: 850.00,
    pendingPayout: 350.00,
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role?: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && (password === 'newpassword123' || password === 'adminpass456' || password === 'agentpass789')) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
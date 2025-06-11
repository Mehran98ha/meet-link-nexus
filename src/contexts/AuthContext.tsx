
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, checkAuth, logoutUser } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = async () => {
    setIsLoading(true);
    const { isAuthenticated, user: authUser } = await checkAuth();
    setUser(authUser || null);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const login = (user: User) => {
    setUser(user);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

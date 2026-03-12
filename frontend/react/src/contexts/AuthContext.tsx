import React, { createContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/api/client';
import type { User, LoginRequest, RegisterRequest, AuthState } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  });

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        setState({
          user,
          token,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
  }, []);

  const handleAuthResponse = useCallback((response: { token: string }) => {
    localStorage.setItem(TOKEN_KEY, response.token);
    
    const user = decodeToken(response.token);
    
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      setState({
        user,
        token: response.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    }
  }, []);

  const decodeToken = (token: string): User | null => {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      
      return {
        id: decoded.userId || decoded.id,
        username: decoded.sub || decoded.username,
        name: decoded.name || decoded.sub,
        role: decoded.role || decoded.authorities?.[0] || 'ROLE_USER',
      };
    } catch {
      return null;
    }
  };

  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  }, []);

  const login = async (data: LoginRequest): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiClient.post('/auth/login', data);
      handleAuthResponse(response.data);
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.response?.data?.message || 'Ошибка входа' 
      }));
      throw error;
    }
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiClient.post('/auth/register', data);
      handleAuthResponse(response.data);
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.response?.data?.message || 'Ошибка регистрации' 
      }));
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      await apiClient.post('/auth/logout');
    } finally {
      clearAuth();
    }
  };

  const updateUser = (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setState(prev => ({ ...prev, user }));
  };

  const clearError = (): void => {
    setState(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      updateUser,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
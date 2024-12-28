import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>('/login', {
        username,
        password
      });

      const { data } = response;

      if (data.success && data.token && data.user) {
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        return {
          success: true,
          isAuthenticated: true,
          user: data.user
        };
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
      return {
        success: false,
        isAuthenticated: false,
        user: null,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await api.get<AuthResponse>('/test-user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success && response.data.user) {
          setUser(response.data.user);
          setIsAuthenticated(true);
          return true;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
      }
    }
    setUser(null);
    setIsAuthenticated(false);
    return false;
  }, []);

  return { user, isAuthenticated, login, logout, checkAuth };
};

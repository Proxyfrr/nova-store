import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nova_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('nova_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await apiClient.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('nova_user', JSON.stringify(res.data));
        } catch (err) {
          console.error("Session verification failed:", err);
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    const { access_token, user: userData } = res.data;
    setToken(access_token);
    setUser(userData);
    localStorage.setItem('nova_token', access_token);
    localStorage.setItem('nova_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await apiClient.post('/auth/register', { name, email, password });
    const { access_token, user: userData } = res.data;
    setToken(access_token);
    setUser(userData);
    localStorage.setItem('nova_token', access_token);
    localStorage.setItem('nova_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    if (token) {
      apiClient.post('/auth/logout').catch(() => {});
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('nova_token');
    localStorage.removeItem('nova_user');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

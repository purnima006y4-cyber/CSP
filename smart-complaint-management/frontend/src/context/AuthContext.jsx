import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('admin');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);

  // Load and verify resident user profile on startup
  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/users/me');
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('[Session expired or invalid]');
          logoutUser();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  // Resident Login
  const loginUser = async (identifier, password) => {
    const res = await api.post('/auth/login', { identifier, password });
    if (res.success && res.token) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setUser(res.user);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  // Resident Register
  const registerUser = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.success && res.token) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setUser(res.user);
      return res;
    }
    throw new Error(res.message || 'Registration failed');
  };

  // Resident Logout
  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Admin Login
  const loginAdmin = async (identifier, password) => {
    const res = await api.post('/auth/admin/login', { identifier, password });
    if (res.success && res.token) {
      localStorage.setItem('adminToken', res.token);
      localStorage.setItem('admin', JSON.stringify(res.admin));
      setAdmin(res.admin);
      return res;
    }
    throw new Error(res.message || 'Admin login failed');
  };

  // Admin Logout
  const logoutAdmin = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    setAdmin(null);
  };

  // Update cached resident data
  const updateCurrentUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,
        loginUser,
        registerUser,
        logoutUser,
        loginAdmin,
        logoutAdmin,
        updateCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

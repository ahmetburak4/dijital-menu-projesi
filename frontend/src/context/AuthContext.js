// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = axios.create({
    // DEĞİŞİKLİK BURADA:
    // Canlıya alındığında Vercel'deki REACT_APP_API_URL değişkenini,
    // kendi bilgisayarımızda ise localhost'u kullanacak.
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    withCredentials: true,
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const { data } = await api.get('/auth/check-session');
        if (data.loggedIn) {
          // Oturumdan dönen kullanıcı ID'sini ve emailini (varsa) state'e ata
          setUser({ id: data.userId, email: data.email }); 
        }
      } catch (error) {
        console.error('Oturum kontrol hatası:', error);
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const register = async (email, password) => {
    const { data } = await api.post('/auth/register', { email, password });
    setUser({ id: data.id, email: data.email });
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser({ id: data.id, email: data.email });
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, register, login, logout, api }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
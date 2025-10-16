// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Context objesini oluşturuyoruz.
const AuthContext = createContext();

// 2. AuthProvider: Uygulamamızı sarmalayacak ve kimlik bilgilerini yönetecek olan ana bileşen.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Giriş yapmış kullanıcıyı tutacak state
  const [loading, setLoading] = useState(true); // Uygulama ilk yüklendiğinde oturum kontrolü için

  // Axios için temel yapılandırma. Bu, her istekle birlikte cookie göndermemizi sağlar.
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true, // ÇOK ÖNEMLİ! Session cookie'sinin gönderilmesini sağlar.
  });

  // Uygulama ilk yüklendiğinde çalışacak olan fonksiyon.
  // Backend'e gidip "Benim geçerli bir oturumum var mı?" diye sorar.
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const { data } = await api.get('/auth/check-session');
        if (data.loggedIn) {
          setUser({ id: data.userId }); // Basit bir kullanıcı objesiyle state'i güncelle
        }
      } catch (error) {
        console.error('Oturum kontrol hatası:', error);
      } finally {
        setLoading(false); // Kontrol bitti, yükleme durumunu kapat
      }
    };
    checkLoggedIn();
  }, []);

  // KAYIT OL fonksiyonu
  const register = async (email, password) => {
    const { data } = await api.post('/auth/register', { email, password });
    setUser({ id: data.id, email: data.email });
  };

  // GİRİŞ YAP fonksiyonu
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser({ id: data.id, email: data.email });
  };

  // ÇIKIŞ YAP fonksiyonu
  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null); // Kullanıcı state'ini temizle
  };

  // 3. Context Provider'ı, sarmaladığı bileşenlere (children) bu değerleri ve fonksiyonları sağlar.
  return (
    <AuthContext.Provider value={{ user, setUser, loading, register, login, logout, api }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
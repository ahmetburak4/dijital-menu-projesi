// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // Oturum durumu kontrol edilirken bekle, hiçbir şey gösterme
  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  // Eğer yükleme bittiyse ve kullanıcı GİRİŞ YAPMAMIŞSA,
  // onu login sayfasına yönlendir.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Eğer kullanıcı giriş yapmışsa, gitmek istediği sayfayı (children) göster.
  return children;
};

export default ProtectedRoute;
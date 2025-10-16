// src/index.js - DÜZELTİLMİŞ HALİ
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // StrictMode'u kaldırdık. Artık sadece AuthProvider ve App var.
  <AuthProvider>
    <App />
  </AuthProvider>
);
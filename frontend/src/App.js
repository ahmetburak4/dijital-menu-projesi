// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import MenuPage from './pages/MenuPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import RestaurantAdminPage from './pages/RestaurantAdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <Route path="/menu/:restaurantId" element={<MenuPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <RestaurantAdminPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/:restaurantId" element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        } />
        <Route path="/" element={
          <div style={{ textAlign: 'center', marginTop: '50px', lineHeight: '1.8' }}>
            <h1>Dijital Menü Projesine Hoş Geldiniz</h1>
            <p>Restoranlarınızı yönetmek için lütfen giriş yapın veya kayıt olun.</p>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
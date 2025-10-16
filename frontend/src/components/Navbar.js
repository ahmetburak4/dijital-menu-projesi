// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={user ? "/dashboard" : "/"} className="navbar-logo">
          Dijital Menü
        </Link>

        <ul className="navbar-menu">
          {user ? (
            // Kullanıcı giriş yapmışsa gösterilecekler
            <>
              <li className="navbar-item">
                <span className="navbar-user-email">{user.email}</span>
              </li>
              <li className="navbar-item">
                <Link to="/dashboard" className="navbar-links">
                  Dashboard
                </Link>
              </li>
              <li className="navbar-item">
                <button onClick={handleLogout} className="navbar-button">
                  Çıkış Yap
                </button>
              </li>
            </>
          ) : (
            // Kullanıcı giriş yapmamışsa gösterilecekler
            <>
              <li className="navbar-item">
                <Link to="/login" className="navbar-links">
                  Giriş Yap
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/register" className="navbar-links-button">
                  Kayıt Ol
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
// src/pages/MenuPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { restaurantId } = useParams();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // DEĞİŞİKLİK BURADA:
        // Tıpkı AuthContext'teki gibi, dinamik bir API adresi tanımlıyoruz.
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/menu/${restaurantId}`);
        setMenuItems(response.data);
      } catch (err) {
        setError('Menü yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    if (restaurantId) {
      fetchMenu();
    }
  }, [restaurantId]);

  const groupedMenu = menuItems.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  if (loading) return <div className="loading-text">Menü Yükleniyor...</div>;
  if (error) return <div className="error-text">{error}</div>;

  return (
    <div className="page-container">
      <div className="menu-container">
        <h1 className="menu-title">Restoran Menüsü</h1>
        {Object.keys(groupedMenu).length > 0 ? (
          Object.keys(groupedMenu).map(category => (
            <div key={category} className="menu-category">
              <h2 className="category-title">{category}</h2>
              {groupedMenu[category].map(item => (
                <div key={item._id} className="menu-item">
                  {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="menu-item-image" />}
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                  </div>
                  <div className="item-price">{item.price} TL</div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="empty-state-message">Bu restorana ait menü ürünü bulunamadı.</p>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
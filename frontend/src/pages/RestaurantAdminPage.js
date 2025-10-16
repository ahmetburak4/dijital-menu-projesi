// src/pages/RestaurantAdminPage.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify';
import './AdminPage.css';
import './RestaurantAdminPage.css';

const RestaurantAdminPage = () => {
  const { api } = useContext(AuthContext);
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurantName, setNewRestaurantName] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // <-- YENİ STATE EKLENDİ

  const fetchRestaurants = async () => {
    setIsLoading(true); // Veri çekmeye başlarken yükleniyor durumunu aç
    try {
      const { data } = await api.get('/restaurants');
      setRestaurants(data);
    } catch (error) {
      console.error('Restoranlar alınamadı:', error);
      toast.error("Restoranlar yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false); // İşlem bitince (başarılı ya da hatalı) yükleniyor durumunu kapat
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    if (!newRestaurantName.trim()) return;
    try {
      await api.post('/restaurants/add', { name: newRestaurantName });
      toast.success(`'${newRestaurantName}' başarıyla eklendi!`);
      setNewRestaurantName('');
      fetchRestaurants();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Bir hata oluştu.');
    }
  };
  
  const getMenuUrl = (restaurantId) => {
    return `${window.location.origin}/menu/${restaurantId}`;
  };

  // Restoran listesini render eden fonksiyon
  const renderRestaurantList = () => {
    if (isLoading) {
      return <div className="loading-text">Restoranlar Yükleniyor...</div>;
    }

    if (restaurants.length === 0) {
      return (
        <div className="empty-state-message">
          Henüz hiç restoran eklemediniz. <br />
          Başlamak için yukarıdaki formu kullanın!
        </div>
      );
    }

    return restaurants.map(resto => (
      <div key={resto._id} className="admin-item">
        <div className="admin-item-info">
          <strong>{resto.name}</strong>
          <span>ID: {resto._id}</span>
        </div>
        <div className="admin-item-actions">
          <button onClick={() => setSelectedRestaurant(resto)} className="btn btn-edit">QR Kod Göster</button>
          <Link to={`/admin/${resto._id}`} className="btn btn-submit" style={{textDecoration: 'none', marginLeft: '10px'}}>Menüyü Yönet</Link>
        </div>
      </div>
    ));
  };

  return (
    <div className="page-container">
      <div className="admin-container">
        <h1 className="admin-title">Yönetim Paneli</h1>
        
        <div className="form-container">
          <h3>Yeni Restoran Ekle</h3>
          <form onSubmit={handleAddRestaurant}>
            <div className="form-group">
              <label>Restoran Adı</label>
              <input type="text" value={newRestaurantName} onChange={(e) => setNewRestaurantName(e.target.value)} placeholder="Örn: Lezzet Durağı" required />
            </div>
            <button type="submit" className="btn btn-submit">Ekle</button>
          </form>
        </div>

        <div className="item-list-container">
          <h3>Restoranlarım</h3>
          {renderRestaurantList()} {/* <-- RENDER FONKSİYONU ÇAĞRILIYOR */}
        </div>

        {selectedRestaurant && (
          <div className="qr-modal" onClick={() => setSelectedRestaurant(null)}>
            <div className="qr-modal-content" onClick={e => e.stopPropagation()}>
              <h3>{selectedRestaurant.name} Menü QR Kodu</h3>
              <QRCodeSVG value={getMenuUrl(selectedRestaurant._id)} size={256} />
              <a href={getMenuUrl(selectedRestaurant._id)} target="_blank" rel="noopener noreferrer">
                {getMenuUrl(selectedRestaurant._id)}
              </a>
              <br/>
              <button onClick={() => setSelectedRestaurant(null)} className="btn btn-delete">Kapat</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantAdminPage;
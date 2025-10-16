// src/pages/AdminPage.js - SÜRÜKLE-BIRAK İÇİN TAM VE KESİN KOD
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import './AdminPage.css';

const AdminPage = () => {
  const { restaurantId } = useParams();
  const { api } = useContext(AuthContext);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '' });
  const [editingItemId, setEditingItemId] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const fetchMenuItems = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/menu/${restaurantId}`);
      setMenuItems(data);
    } catch (error) {
      toast.error("Menü öğeleri yüklenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (restaurantId) {
      fetchMenuItems();
    }
  }, [restaurantId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', category: '' });
    setEditingItemId(null);
    setImageUrl('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadForm = new FormData();
    uploadForm.append('image', file);
    setIsUploading(true);
    try {
      const { data } = await api.post('/upload', uploadForm, { headers: { 'Content-Type': 'multipart/form-data' } });
      setImageUrl(data.secure_url);
      toast.success("Resim başarıyla yüklendi!");
    } catch (error) {
      toast.error("Resim yüklenirken bir hata oluştu.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = { ...formData, restaurantId, imageUrl };
    try {
      if (editingItemId) {
        await api.put(`/menu/${editingItemId}`, dataToSubmit);
        toast.success("Ürün başarıyla güncellendi!");
      } else {
        await api.post('/menu/add', dataToSubmit);
        toast.success("Ürün başarıyla eklendi!");
      }
      resetForm();
      fetchMenuItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "İşlem sırasında bir hata oluştu.");
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        await api.delete(`/menu/${itemId}`);
        toast.success("Ürün başarıyla silindi.");
        fetchMenuItems();
      } catch (error) {
        toast.error("Ürün silinirken bir hata oluştu.");
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItemId(item._id);
    setFormData({ name: item.name, description: item.description, price: item.price, category: item.category });
    setImageUrl(item.imageUrl || '');
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const items = Array.from(menuItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setMenuItems(items);
    const orderedIds = items.map(item => item._id);
    try {
      await api.put('/menu/reorder', { orderedIds });
      toast.success("Sıralama güncellendi!");
    } catch (error) {
      toast.error("Sıralama güncellenirken bir hata oluştu.");
    }
  };

  const renderMenuList = () => {
    if (isLoading) { return <div className="loading-text">Menü Öğeleri Yükleniyor...</div>; }
    if (menuItems.length === 0) { return <div className="empty-state-message">Bu restorana ait henüz menü öğesi yok.</div>; }
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="menuItems">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {menuItems.map((item, index) => (
                <Draggable key={item._id} draggableId={item._id} index={index}>
                  {(provided) => (
                    <div className="admin-item" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="admin-item-image" />}
                      <div className="admin-item-info">
                        <strong>{item.name}</strong> ({item.category}) - {item.price} TL
                        <span>{item.description}</span>
                      </div>
                      <div className="admin-item-actions">
                        <button onClick={() => handleEdit(item)} className="btn btn-edit">Düzenle</button>
                        <button onClick={() => handleDelete(item._id)} className="btn btn-delete">Sil</button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  };

  return (
    <div className="page-container">
      <div className="admin-container">
        <h1 className="admin-title">Menü Yönetimi</h1>
        <div className="form-container">
          <h3>{editingItemId ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Ürün Adı</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required /></div>
            <div className="form-group"><label>Açıklama</label><input type="text" name="description" value={formData.description} onChange={handleInputChange} /></div>
            <div className="form-group"><label>Fiyat (TL)</label><input type="number" name="price" value={formData.price} onChange={handleInputChange} required /></div>
            <div className="form-group"><label>Kategori</label><input type="text" name="category" value={formData.category} onChange={handleInputChange} required /></div>
            <div className="form-group">
              <label>Ürün Resmi</label>
              <input type="file" id="imageUpload" onChange={handleImageUpload} accept="image/*" />
              <label htmlFor="imageUpload" className="upload-label">{isUploading ? "Yükleniyor..." : "Resim Seç"}</label>
              {imageUrl && <div className="image-preview-container"><img src={imageUrl} alt="Önizleme" className="image-preview" /></div>}
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn btn-submit" disabled={isUploading}>{editingItemId ? 'Güncelle' : 'Ekle'}</button>
              <button type="button" className="btn btn-clear" onClick={resetForm}>Temizle</button>
            </div>
          </form>
        </div>
        <div className="item-list-container">
          <h3>Mevcut Ürünler</h3>
          {renderMenuList()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
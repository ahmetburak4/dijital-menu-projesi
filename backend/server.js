// backend/server.js
const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();
const connectDB = require('./db/connection');
const uploadCloud = require('./config/cloudinary'); // <-- YENİ EKLENDİ

const menuRoutes = require('./routes/menu');
const restaurantRoutes = require('./routes/restaurants');
const authRoutes = require('./routes/auth');

connectDB();
const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(session({
  secret: 'bu-cok-gizli-bir-anahtar-olmalı',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }
}));

// DOSYA YÜKLEME ROUTE'U <-- YENİ EKLENDİ
// Frontend'den 'image' adıyla gönderilen tek bir dosyayı alıp Cloudinary'e yükler.
app.post('/api/upload', uploadCloud.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Lütfen bir dosya seçin.' });
  }
  // Yükleme başarılıysa, Cloudinary tarafından sağlanan güvenli URL'yi geri döndürür.
  res.status(200).json({ secure_url: req.file.path });
});

app.get('/', (req, res) => res.send('Dijital Menü Backend Sunucusu Çalışıyor!'));

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/restaurants', restaurantRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda başarıyla başlatıldı.`));
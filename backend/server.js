// backend/server.js - CANLI ORTAM İÇİN GÜNCELLENDİ

const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();
const connectDB = require('./db/connection');
const uploadCloud = require('./config/cloudinary');

const menuRoutes = require('./routes/menu');
const restaurantRoutes = require('./routes/restaurants');
const authRoutes = require('./routes/auth');

connectDB();
const app = express();

// --- DEĞİŞİKLİK BURADA ---
// Artık hem localhost'tan hem de canlı Vercel sitemizden gelen isteklere izin veriyoruz.
const allowedOrigins = [
  'http://localhost:3000',
  'https://dijital-menu-projesi-iis9tay75-ahmet-buraks-projects-c6fdec2d.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Eğer gelen istek bu listelerden birindeyse veya bir API test aracıysa (origin yoksa) izin ver
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
// --- DEĞİŞİKLİK SONA ERDİ ---

app.use(express.json());
app.use(session({
  secret: 'bu-cok-gizli-bir-anahtar-olmalı', // Canlıda bunu .env'ye taşımak en iyisidir
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // Canlıda (HTTPS) true olmalı
    httpOnly: true,
    sameSite: 'none', // Tarayıcılar arası cookie için
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// Yükleme ve diğer rotalar...
app.post('/api/upload', uploadCloud.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Lütfen bir dosya seçin.' });
  }
  res.status(200).json({ secure_url: req.file.path });
});
app.get('/', (req, res) => res.send('Dijital Menü Backend Sunucusu Çalışıyor!'));
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/restaurants', restaurantRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda başarıyla başlatıldı.`));
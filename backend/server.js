// backend/server.js - FİNAL CANLI ORTAM VERSİYONU (KALICI OTURUM)

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // <-- YENİ KÜTÜPHANE
require('dotenv').config();
const connectDB = require('./db/connection');
const uploadCloud = require('./config/cloudinary');

const menuRoutes = require('./routes/menu');
const restaurantRoutes = require('./routes/restaurants');
const authRoutes = require('./routes/auth');

connectDB();
const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://dijital-menu-projesi-iis9tay75-ahmet-buraks-projects-c6fdec2d.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) { callback(null, true); } 
    else { callback(new Error('Not allowed by CORS')); }
  },
  credentials: true
}));

app.set('trust proxy', 1);
app.use(express.json());

// --- OTURUM AYARLARI GÜNCELLENDİ ---
app.use(session({
  secret: 'bu-cok-gizli-bir-anahtar-olmalı-ve-degistirilmeli',
  resave: false,
  saveUninitialized: false,
  // Oturumları RAM yerine MongoDB'ye kaydet
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions' // Oturumların saklanacağı koleksiyonun adı
  }),
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 // 1 gün
  }
}));
// --- GÜNCELLEME SONA ERDİ ---

// Yükleme ve diğer rotalar...
app.post('/api/upload', uploadCloud.single('image'), (req, res) => {
  if (!req.file) { return res.status(400).json({ message: 'Lütfen bir dosya seçin.' }); }
  res.status(200).json({ secure_url: req.file.path });
});
app.get('/', (req, res) => res.send('Dijital Menü Backend Sunucusu Çalışıyor!'));
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/restaurants', restaurantRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda başarıyla başlatıldı.`));
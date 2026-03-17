/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║           PulseForge — Express Server                    ║
 * ║   Smart Fitness Equipment Store REST API                 ║
 * ╚══════════════════════════════════════════════════════════╝
 */

require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const path       = require('path');

// Route modules
const productRoutes    = require('./routes/products');
const orderRoutes      = require('./routes/orders');
const newsletterRoutes = require('./routes/newsletter');
const contactRoutes    = require('./routes/contact');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:5000', '*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// ── API Routes ────────────────────────────────────────────────
app.use('/api/products',   productRoutes);
app.use('/api/orders',     orderRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact',    contactRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'PulseForge API',
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Catch-all: serve frontend for any non-API route (SPA support)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  }
});

// ── Global Error Handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// ── MongoDB Connection ────────────────────────────────────────
// const mongoose = required('mongoose'):
// mangoose.connect(process.env.mongodb+srv: /creatorboy232_db_user:<db_password>@cluster0.21d2h2f.mongodb.net/)
// .then(()=> console.log("DB connected"))
// .catch(err => console.log(err))

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pulseforge';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅  MongoDB connected →', MONGODB_URI.replace(/\/\/.*@/, '//***@'));
    app.listen(PORT, () => {
      console.log(`🚀  PulseForge server running   → http://localhost:${PORT}`);
      console.log(`📦  API available               → http://localhost:${PORT}/api`);
      console.log(`🛍️   Storefront                  → http://localhost:${PORT}`);
      console.log('─'.repeat(58));
      console.log('💡  Run  node seed.js  to populate products');
    });
  })
  .catch((err) => {
    console.warn('⚠️   MongoDB unavailable:', err.message);
    console.log('🔄  Starting in MOCK DATA mode (no DB required)...');
    app.listen(PORT, () => {
      console.log(`🚀  PulseForge server running   → http://localhost:${PORT}`);
      console.log(`📦  API (mock mode)             → http://localhost:${PORT}/api`);
    });
  });

module.exports = app;

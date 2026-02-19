'use strict';

require('dotenv').config();

const express = require('express');
const path    = require('path');
const fs      = require('fs');
const { testConnection } = require('./config/db');

// load models so Sequelize registers them before any route handler runs
require('./models');

const authRoutes  = require('./routes/auth.routes');
const scoreRoutes = require('./routes/score.routes');

const app  = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ensure upload directory exists and serve it statically
const uploadDir = path.join(process.cwd(), process.env.SCORE_CARD_DIR || 'uploads/score_cards');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/health', (_req, res) => {
  res.status(200).json({
    success:   true,
    message:   'Gems Cricket API is running.',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth',  authRoutes);
app.use('/api/score', scoreRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

const startServer = async () => {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to database:', err.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;

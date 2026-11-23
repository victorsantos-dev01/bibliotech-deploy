const express = require('express');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');

const app = express();

// CORS_ORIGIN = URL(s) do frontend permitidas, separadas por vírgula.
// Ex.: https://bibliotech-web.onrender.com
// Se não for definida, qualquer origem é aceita (útil só em desenvolvimento).
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(
  cors(allowedOrigins.length > 0 ? { origin: allowedOrigins } : undefined)
);
app.use(express.json());

app.use('/api/books', bookRoutes);

module.exports = app;
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const movementRoutes = require('./routes/movementRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { errorHandler } = require('./middlewares/errorHandler');
const { authMiddleware } = require('./middlewares/authMiddleware');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../../frontend')));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Rotas públicas
app.use('/api/auth', authRoutes);

// Rotas protegidas (requerem autenticação)
app.use('/api/categories', authMiddleware, categoryRoutes);
app.use('/api/products', authMiddleware, productRoutes);
app.use('/api/movements', authMiddleware, movementRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

// Servir index.html para todas as rotas (SPA)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/app.html'));
});

app.use(errorHandler);

module.exports = app;

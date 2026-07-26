require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Supplier = require('./models/Supplier');
const Purchase = require('./models/Purchase');
const Sale = require('./models/Sale');
const Notification = require('./models/Notification');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const saleRoutes = require('./routes/saleRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Inventory Management API is running'));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);

sequelize.authenticate()
  .then(() => console.log('PostgreSQL connected'))
  .then(() => sequelize.sync())
  .then(() => console.log('Models synced'))
  .catch((err) => console.error('DB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
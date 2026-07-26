const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Product = require('./Product');

const Sale = sequelize.define('Sale', {
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unitPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.ENUM('paid', 'pending', 'partial'),
    defaultValue: 'paid',
  },
});

Sale.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(Sale, { foreignKey: 'productId' });

module.exports = Sale;
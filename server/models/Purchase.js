const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Product = require('./Product');
const Supplier = require('./Supplier');

const Purchase = sequelize.define('Purchase', {
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
});

// Relationships
Purchase.belongsTo(Product, { foreignKey: 'productId' });
Purchase.belongsTo(Supplier, { foreignKey: 'supplierId' });
Product.hasMany(Purchase, { foreignKey: 'productId' });
Supplier.hasMany(Purchase, { foreignKey: 'supplierId' });

module.exports = Purchase;
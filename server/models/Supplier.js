const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Supplier = sequelize.define('Supplier', {
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactPerson: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
});

module.exports = Supplier;
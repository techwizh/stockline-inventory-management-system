const express = require('express');
const { Op, fn, col } = require('sequelize');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

const LOW_STOCK_THRESHOLD = 10;

router.get('/', protect, async (req, res) => {
  try {
    // Total products
    const totalProducts = await Product.count();

    // Total distinct categories
    const categories = await Product.findAll({
      attributes: [[fn('DISTINCT', col('category')), 'category']],
    });
    const totalCategories = categories.filter((c) => c.category).length;

    // Low stock items
    const lowStockItems = await Product.findAll({
      where: { quantity: { [Op.lte]: LOW_STOCK_THRESHOLD } },
    });

    // Inventory value (sum of quantity * purchasePrice for all products)
    const allProducts = await Product.findAll();
    const inventoryValue = allProducts.reduce(
      (sum, p) => sum + p.quantity * p.purchasePrice,
      0
    );

    // Today's sales
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysSales = await Sale.findAll({
      where: { createdAt: { [Op.between]: [startOfDay, endOfDay] } },
    });
    const todaysSalesTotal = todaysSales.reduce((sum, s) => sum + s.totalAmount, 0);

    // Monthly revenue
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlySales = await Sale.findAll({
      where: { createdAt: { [Op.gte]: startOfMonth } },
    });
    const monthlyRevenue = monthlySales.reduce((sum, s) => sum + s.totalAmount, 0);

    res.json({
      totalProducts,
      totalCategories,
      lowStockCount: lowStockItems.length,
      lowStockItems,
      inventoryValue,
      todaysSalesTotal,
      monthlyRevenue,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
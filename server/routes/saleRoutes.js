const express = require('express');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const protect = require('../middleware/authMiddleware');
const { checkStockAndNotify } = require('../utils/notify');

const router = express.Router();

// Create sale (with stock check)
router.post('/', protect, async (req, res) => {
  try {
    const { productId, customerName, quantity, unitPrice, paymentStatus } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.quantity < quantity) {
      return res.status(400).json({
        message: `Not enough stock. Available: ${product.quantity}, Requested: ${quantity}`,
      });
    }

    const totalAmount = quantity * unitPrice;

    const sale = await Sale.create({
      productId,
      customerName,
      quantity,
      unitPrice,
      totalAmount,
      paymentStatus: paymentStatus || 'paid',
    });

    // Decrease stock
    product.quantity -= quantity;
    await product.save();

    // Check if we need to notify about low/out of stock
    await checkStockAndNotify(product);

    res.status(201).json({ sale, updatedStock: product.quantity });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all sales
router.get('/', protect, async (req, res) => {
  try {
    const sales = await Sale.findAll({ include: [{ all: true }] });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
const express = require('express');
const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const Notification = require('../models/Notification');

const router = express.Router();

// Create purchase — admin, manager only
router.post('/', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { productId, supplierId, quantity, unitPrice } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const totalAmount = quantity * unitPrice;

    const purchase = await Purchase.create({
      productId,
      supplierId,
      quantity,
      unitPrice,
      totalAmount,
    });

    product.quantity += quantity;
    await product.save();

    // Notify that a new purchase order came in
    await Notification.create({
      type: 'new_purchase',
      message: `New purchase order: ${quantity} units of ${product.name} received.`,
    });

    res.status(201).json({ purchase, updatedStock: product.quantity });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all purchases — everyone logged in
router.get('/', protect, async (req, res) => {
  try {
    const purchases = await Purchase.findAll({ include: [{ all: true }] });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
const Notification = require('../models/Notification');

const LOW_STOCK_THRESHOLD = 10;

const checkStockAndNotify = async (product) => {
  if (product.quantity === 0) {
    await Notification.create({
      type: 'out_of_stock',
      message: `${product.name} (SKU: ${product.sku}) is out of stock.`,
    });
  } else if (product.quantity <= LOW_STOCK_THRESHOLD) {
    await Notification.create({
      type: 'low_stock',
      message: `${product.name} (SKU: ${product.sku}) is low on stock: ${product.quantity} left.`,
    });
  }
};

module.exports = { checkStockAndNotify };
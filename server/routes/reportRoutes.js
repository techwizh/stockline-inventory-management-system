const express = require('express');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const Product = require('../models/Product');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Inventory report - Excel
router.get('/inventory/excel', protect, async (req, res) => {
  try {
    const products = await Product.findAll();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Inventory Report');

    sheet.columns = [
      { header: 'Name', key: 'name', width: 25 },
      { header: 'SKU', key: 'sku', width: 15 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Brand', key: 'brand', width: 20 },
      { header: 'Quantity', key: 'quantity', width: 12 },
      { header: 'Purchase Price', key: 'purchasePrice', width: 15 },
      { header: 'Selling Price', key: 'sellingPrice', width: 15 },
      { header: 'Stock Value', key: 'stockValue', width: 15 },
    ];

    products.forEach((p) => {
      sheet.addRow({
        name: p.name,
        sku: p.sku,
        category: p.category,
        brand: p.brand,
        quantity: p.quantity,
        purchasePrice: p.purchasePrice,
        sellingPrice: p.sellingPrice,
        stockValue: p.quantity * p.purchasePrice,
      });
    });

    sheet.getRow(1).font = { bold: true };

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=inventory_report.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Inventory report - PDF
router.get('/inventory/pdf', protect, async (req, res) => {
  try {
    const products = await Product.findAll();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=inventory_report.pdf');

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    doc.pipe(res);

    doc.fontSize(18).text('Inventory Report', { align: 'center' });
    doc.moveDown();

    products.forEach((p) => {
      doc
        .fontSize(11)
        .text(
          `${p.name} | SKU: ${p.sku} | Qty: ${p.quantity} | Stock Value: ${p.quantity * p.purchasePrice}`
        );
      doc.moveDown(0.3);
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
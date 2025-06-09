
const mongoose = require('mongoose');
const Product = require('./Product');

const printerSchema = new mongoose.Schema({
  type: { type: String, required: true },
  connectivity: { type: String, required: true },
  paperSize: { type: String, required: true },
  // Additional printer-specific fields
  macAddress: { type: String },
  ipAddress: { type: String },
  hostName: { type: String },
  partCode: { type: String },
  verifiedStatus: { type: String },
  conditionStatus: { type: String }
});

const Printer = Product.discriminator('Printer', printerSchema);

module.exports = Printer;

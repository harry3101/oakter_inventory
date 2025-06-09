
const mongoose = require('mongoose');
const Product = require('./Product');

const miscItemSchema = new mongoose.Schema({
  category: { type: String, required: true },
  description: { type: String, required: true },
  // Additional misc-specific fields
  partCode: { type: String },
  adapterSerialNumber: { type: String },
  verifiedStatus: { type: String },
  conditionStatus: { type: String }
});

const MiscItem = Product.discriminator('MiscItem', miscItemSchema);

module.exports = MiscItem;

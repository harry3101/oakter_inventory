
const mongoose = require('mongoose');
const Product = require('./Product');

const adapterSchema = new mongoose.Schema({
  wattage: { type: String, required: true },
  compatibleDevices: { type: String, required: true },
  cableLength: { type: String, required: true },
  // Additional adapter-specific fields
  verifiedStatus: { type: String },
  partCode: { type: String }
});

const Adapter = Product.discriminator('Adapter', adapterSchema);

module.exports = Adapter;

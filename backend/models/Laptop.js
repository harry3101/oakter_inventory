const mongoose = require('mongoose');
const Product = require('./Product');

const laptopSchema = new mongoose.Schema({
  processorType: { type: String },
  ram: { type: String },
  storageCapacity: { type: String },
  operatingSystem: { type: String },
  // Additional laptop-specific fields
  adapterSerialNumber: { type: String },
  purchasedWindowsKey: { type: String },
  macAddress: { type: String },
  ipAddress: { type: String },
  hostName: { type: String },
  officeKey: { type: String },
  controlAccounts: { type: String },
  adminPassword: { type: String },
  conditionStatus: { type: String }
});

const Laptop = Product.discriminator('Laptop', laptopSchema);

module.exports = Laptop;

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  serialNumber: { type: String },  // Simple string field without any constraints
  model: { type: String },
  manufacturer: { type: String },
  purchaseDate: { type: Date },
  status: { 
    type: String, 
    enum: ["assigned", "available", "maintenance", "retired", "new", "active", "repair"],
    default: "available"
  },
  // Additional fields from form requirements
  price: { type: String },
  invoiceNumber: { type: String },
  poNumber: { type: String },
  warranty: { type: String },
  previousUser: { type: String },
  vendorContact: { type: String },
  vendorEmail: { type: String },
  location: { type: String },
  assignedDate: { type: Date },
  returnDate: { type: Date },
  attachedInvoice: { type: String }, // File path or reference
  attachedPO: { type: String }, // File path or reference
  transactionDetails: { type: String }
}, { 
  timestamps: true,
  discriminatorKey: 'productType' 
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

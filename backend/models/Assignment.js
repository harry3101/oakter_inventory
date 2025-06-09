const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  // Employee details
  employeeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Employee',
    required: true 
  },
  employeeName: { type: String, required: true },
  employeeEmail: { type: String, required: true },
  department: { type: String, required: true },
  employeeDesignation: { type: String },
  operatorName: { type: String },
  location: { type: String },
  
  // Assignment details
  assignedDate: { type: Date, required: true, default: Date.now },
  expectedReturnDate: { type: Date },
  actualReturnDate: { type: Date },
  notes: { type: String },
  isActive: { type: Boolean, default: true },
  
  // Asset details
  assetType: { type: String, required: true },
  serialNumber: { type: String },
  model: { type: String },
  manufacturer: { type: String },
  purchaseDate: { type: Date },
  status: { 
    type: String, 
    enum: ["assigned", "available", "maintenance", "retired", "new", "active", "repair"],
    default: "active"
  },
  
  // Laptop specific details
  processorType: { type: String },
  ram: { type: String },
  storageCapacity: { type: String },
  operatingSystem: { type: String },
  adapterSerialNumber: { type: String },
  
  // Additional details
  previousUser: { type: String },
  price: { type: String },
  invoiceNumber: { type: String },
  poNumber: { type: String },
  warranty: { type: String },
  vendorContact: { type: String },
  vendorEmail: { type: String },
  transactionDetails: { type: String }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add virtual for formatted dates
assignmentSchema.virtual('formattedAssignedDate').get(function() {
  return this.assignedDate ? new Date(this.assignedDate).toLocaleDateString() : '';
});

assignmentSchema.virtual('formattedExpectedReturnDate').get(function() {
  return this.expectedReturnDate ? new Date(this.expectedReturnDate).toLocaleDateString() : '';
});

assignmentSchema.virtual('formattedActualReturnDate').get(function() {
  return this.actualReturnDate ? new Date(this.actualReturnDate).toLocaleDateString() : '';
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;

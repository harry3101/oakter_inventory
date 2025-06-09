const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const inventoryRoutes = require('./routes/inventory');
const assignmentRoutes = require('./routes/assignments');
const employeeRoutes = require('./routes/employees');
const testEmailRoutes = require('./routes/test-email');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB Connection Options
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Connect to MongoDB with better error handling
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('Successfully connected to MongoDB.');
    console.log('Database:', mongoose.connection.db.databaseName);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.error('Please check your MongoDB credentials and connection string');
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Initialize database connection
connectDB();

// Routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api', testEmailRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

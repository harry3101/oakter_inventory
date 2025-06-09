
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Laptop = require('../models/Laptop');
const Adapter = require('../models/Adapter');
const Printer = require('../models/Printer');
const MiscItem = require('../models/MiscItem');

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const { type, status } = req.query;
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    let items = [];
    
    if (type === 'laptop') {
      items = await Laptop.find(query);
    } else if (type === 'adapter') {
      items = await Adapter.find(query);
    } else if (type === 'printer') {
      items = await Printer.find(query);
    } else if (type === 'misc') {
      items = await MiscItem.find(query);
    } else {
      // Get all items
      const laptops = await Laptop.find(query);
      const adapters = await Adapter.find(query);
      const printers = await Printer.find(query);
      const misc = await MiscItem.find(query);
      items = [...laptops, ...adapters, ...printers, ...misc];
    }
    
    res.json(items);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get specific inventory item
router.get('/:id', async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create laptop
router.post('/laptop', async (req, res) => {
  try {
    // Handle file uploads if implemented
    const laptop = new Laptop(req.body);
    const newLaptop = await laptop.save();
    res.status(201).json(newLaptop);
  } catch (error) {
    console.error('Error creating laptop:', error);
    res.status(400).json({ message: error.message });
  }
});

// Create adapter
router.post('/adapter', async (req, res) => {
  try {
    const adapter = new Adapter(req.body);
    const newAdapter = await adapter.save();
    res.status(201).json(newAdapter);
  } catch (error) {
    console.error('Error creating adapter:', error);
    res.status(400).json({ message: error.message });
  }
});

// Create printer
router.post('/printer', async (req, res) => {
  try {
    const printer = new Printer(req.body);
    const newPrinter = await printer.save();
    res.status(201).json(newPrinter);
  } catch (error) {
    console.error('Error creating printer:', error);
    res.status(400).json({ message: error.message });
  }
});

// Create misc item
router.post('/misc', async (req, res) => {
  try {
    const miscItem = new MiscItem(req.body);
    const newMiscItem = await miscItem.save();
    res.status(201).json(newMiscItem);
  } catch (error) {
    console.error('Error creating misc item:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update inventory item
router.patch('/:id', async (req, res) => {
  try {
    const updatedItem = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete inventory item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Product.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

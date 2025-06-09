const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Employee = require('../models/Employee');
const { sendAssignmentEmail } = require('../config/email');

// Get all assignments
router.get('/', async (req, res) => {
  try {
    const assignments = await Assignment.find().populate('employeeId');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get assignment history (including returned items)
router.get('/history', async (req, res) => {
  try {
    const history = await Assignment.find({ actualReturnDate: { $ne: null } })
      .populate('employeeId');
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get active assignments (not returned)
router.get('/active', async (req, res) => {
  try {
    const activeAssignments = await Assignment.find({ 
      actualReturnDate: null,
      isActive: true
    }).populate('employeeId');
    res.json(activeAssignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get specific assignment
router.get('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('employeeId');
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new assignment
router.post('/', async (req, res) => {
  try {
    // Check if employee exists
    const employee = await Employee.findById(req.body.employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Validate asset type
    const validAssetTypes = ['Laptop', 'Printer', 'Adapter'];
    if (!validAssetTypes.includes(req.body.assetType)) {
      return res.status(400).json({ 
        message: 'Invalid asset type. Must be one of: Laptop, Printer, Adapter' 
      });
    }

    // Create assignment with validated data
    const assignment = new Assignment({
      ...req.body,
      employeeName: employee.name,
      employeeEmail: employee.email,
      department: employee.department,
      isActive: true
    });

    const newAssignment = await assignment.save();
    
    // Send email notification
    try {
      await sendAssignmentEmail(employee, {
        name: newAssignment.assetType,
        type: newAssignment.assetType,
        serialNumber: newAssignment.serialNumber
      }, newAssignment.assignedDate);
      
      console.log('Assignment email sent successfully');
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Continue with the assignment process even if email fails
    }
    
    res.status(201).json(newAssignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(400).json({ message: error.message });
  }
});

// Return an item (update assignment)
router.patch('/:id/return', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    
    // Update assignment with return date and any notes
    assignment.actualReturnDate = req.body.actualReturnDate || new Date();
    assignment.notes = req.body.notes || assignment.notes;
    assignment.isActive = false;
    
    await assignment.save();
    res.json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update assignment
router.patch('/:id', async (req, res) => {
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAssignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json(updatedAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete assignment
router.delete('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json({ message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

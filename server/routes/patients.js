import express from 'express';
import Patient from '../models/Patient.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/patients
// @desc    Get all patients
// @access  Private (Admin/Doctor)
router.get('/', protect, authorize('admin', 'doctor'), async (req, res) => {
  try {
    const { search } = req.query;
    let patients = await Patient.find();

    if (search) {
      patients = patients.filter(p =>
        p.user && p.user.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json({ success: true, count: patients.length, data: patients });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/patients/me
// @desc    Get current patient profile
// @access  Private (Patient)
router.get('/me', protect, async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/patients/:id
// @desc    Get patient by ID
// @access  Private (Admin/Doctor)
router.get('/:id', protect, authorize('admin', 'doctor'), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/patients/:id
// @desc    Update patient profile
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // Only allow patient to update their own profile, or admin
    if (patient.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Update user fields
    if (req.body.name || req.body.phone) {
      await User.findByIdAndUpdate(patient.user._id, {
        ...(req.body.name && { name: req.body.name }),
        ...(req.body.phone && { phone: req.body.phone })
      });
    }

    // Update patient fields
    const updateFields = {};
    const patientFields = ['dateOfBirth', 'gender', 'bloodGroup', 'address', 'medicalHistory', 'allergies', 'emergencyContact', 'insuranceInfo'];
    patientFields.forEach(field => {
      if (req.body[field] !== undefined) updateFields[field] = req.body[field];
    });

    patient = await Patient.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: patient });
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;

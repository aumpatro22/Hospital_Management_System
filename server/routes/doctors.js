import express from 'express';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { department, status, search } = req.query;
    let query = {};

    if (department) query.department = department;
    if (status) query.status = status;

    let doctors = await Doctor.find(query);

    // Search by name
    if (search) {
      doctors = doctors.filter(doc =>
        doc.user && doc.user.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/doctors/:id
// @desc    Get single doctor
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/doctors
// @desc    Add a new doctor
// @access  Private (Admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, email, password, phone, specialization, qualification, experience, fees, department, bio, availability } = req.body;

    // Create user account for doctor
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    user = await User.create({
      name,
      email,
      password: password || 'doctor123',
      role: 'doctor',
      phone
    });

    // Create doctor profile
    const doctor = await Doctor.create({
      user: user._id,
      department,
      specialization,
      qualification,
      experience,
      fees,
      bio,
      availability
    });

    const populatedDoctor = await Doctor.findById(doctor._id);

    res.status(201).json({ success: true, data: populatedDoctor });
  } catch (error) {
    console.error('Add doctor error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/doctors/:id
// @desc    Update doctor
// @access  Private (Admin/Doctor)
router.put('/:id', protect, authorize('admin', 'doctor'), async (req, res) => {
  try {
    let doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Update user fields if provided
    if (req.body.name || req.body.phone) {
      await User.findByIdAndUpdate(doctor.user._id || doctor.user, {
        ...(req.body.name && { name: req.body.name }),
        ...(req.body.phone && { phone: req.body.phone })
      });
    }

    // Update doctor fields
    const updateFields = {};
    const doctorFields = ['specialization', 'qualification', 'experience', 'fees', 'department', 'status', 'bio', 'availability'];
    doctorFields.forEach(field => {
      if (req.body[field] !== undefined) updateFields[field] = req.body[field];
    });

    doctor = await Doctor.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: doctor });
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/doctors/:id
// @desc    Delete doctor
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Deactivate user account instead of deleting
    await User.findByIdAndUpdate(doctor.user._id || doctor.user, { isActive: false });
    await Doctor.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Doctor removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;

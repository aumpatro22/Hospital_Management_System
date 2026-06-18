import express from 'express';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/appointments
// @desc    Get appointments (filtered by role)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    const { status, date, doctor: doctorId } = req.query;

    // Role-based filtering
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user.id });
      if (patient) query.patient = patient._id;
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user.id });
      if (doctor) query.doctor = doctor._id;
    }

    if (status) query.status = status;
    if (doctorId) query.doctor = doctorId;
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const appointments = await Appointment.find(query).sort({ date: -1, timeSlot: 1 });

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get single appointment
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/appointments
// @desc    Book a new appointment
// @access  Private (Patient)
router.post('/', protect, async (req, res) => {
  try {
    const { doctor, department, date, timeSlot, symptoms, type } = req.body;

    // Get patient profile
    let patient = await Patient.findOne({ user: req.user.id });
    if (!patient && req.user.role === 'patient') {
      // Auto-create patient profile if missing
      patient = await Patient.create({ user: req.user.id });
    }

    if (!patient && req.user.role !== 'admin') {
      return res.status(400).json({ success: false, message: 'Patient profile not found' });
    }

    // For admin creating appointment, patient ID should be in body
    const patientId = req.user.role === 'admin' ? req.body.patient : patient._id;

    // Get doctor fees
    const doctorDoc = await Doctor.findById(doctor);
    const fees = doctorDoc ? doctorDoc.fees : 0;

    // Check for conflicting appointments
    const existingAppt = await Appointment.findOne({
      doctor,
      date: new Date(date),
      timeSlot,
      status: { $nin: ['cancelled'] }
    });

    if (existingAppt) {
      return res.status(400).json({ success: false, message: 'This time slot is already booked' });
    }

    const appointment = await Appointment.create({
      patient: patientId,
      doctor,
      department,
      date,
      timeSlot,
      symptoms,
      type: type || 'consultation',
      fees
    });

    const populatedAppt = await Appointment.findById(appointment._id);

    res.status(201).json({ success: true, data: populatedAppt });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment (status, diagnosis, prescription)
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const updateFields = {};
    const allowedFields = ['status', 'diagnosis', 'prescription', 'notes', 'date', 'timeSlot', 'isPaid'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updateFields[field] = req.body[field];
    });

    appointment = await Appointment.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: appointment });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Cancel appointment
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Mark as cancelled instead of deleting
    await Appointment.findByIdAndUpdate(req.params.id, { status: 'cancelled' });

    res.json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;

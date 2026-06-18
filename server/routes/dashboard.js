import express from 'express';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import Department from '../models/Department.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    let stats = {};

    if (req.user.role === 'admin') {
      const [totalDoctors, totalPatients, totalAppointments, totalDepartments] = await Promise.all([
        Doctor.countDocuments(),
        Patient.countDocuments(),
        Appointment.countDocuments(),
        Department.countDocuments({ isActive: true })
      ]);

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const todayAppointments = await Appointment.countDocuments({
        date: { $gte: todayStart, $lte: todayEnd }
      });

      const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });

      // Revenue from completed paid appointments
      const revenueResult = await Appointment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$fees' } } }
      ]);

      const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

      // Monthly appointment trends (last 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const monthlyTrends = await Appointment.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);

      // Department-wise appointment distribution
      const departmentStats = await Appointment.aggregate([
        { $group: { _id: '$department', count: { $sum: 1 } } },
        {
          $lookup: {
            from: 'departments',
            localField: '_id',
            foreignField: '_id',
            as: 'department'
          }
        },
        { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            name: { $ifNull: ['$department.name', 'Unknown'] },
            count: 1
          }
        },
        { $sort: { count: -1 } }
      ]);

      // Recent appointments
      const recentAppointments = await Appointment.find()
        .sort({ createdAt: -1 })
        .limit(5);

      stats = {
        totalDoctors,
        totalPatients,
        totalAppointments,
        totalDepartments,
        todayAppointments,
        pendingAppointments,
        totalRevenue,
        monthlyTrends,
        departmentStats,
        recentAppointments
      };
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user.id });
      if (doctor) {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const [totalAppointments, todayAppointments, pendingAppointments, completedAppointments] = await Promise.all([
          Appointment.countDocuments({ doctor: doctor._id }),
          Appointment.countDocuments({ doctor: doctor._id, date: { $gte: todayStart, $lte: todayEnd } }),
          Appointment.countDocuments({ doctor: doctor._id, status: 'pending' }),
          Appointment.countDocuments({ doctor: doctor._id, status: 'completed' })
        ]);

        // Unique patients
        const uniquePatients = await Appointment.distinct('patient', { doctor: doctor._id });

        const recentAppointments = await Appointment.find({ doctor: doctor._id })
          .sort({ date: -1 })
          .limit(5);

        stats = {
          totalAppointments,
          todayAppointments,
          pendingAppointments,
          completedAppointments,
          totalPatients: uniquePatients.length,
          recentAppointments
        };
      }
    } else if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user.id });
      if (patient) {
        const [totalAppointments, upcomingAppointments, completedAppointments] = await Promise.all([
          Appointment.countDocuments({ patient: patient._id }),
          Appointment.countDocuments({
            patient: patient._id,
            date: { $gte: new Date() },
            status: { $in: ['pending', 'confirmed'] }
          }),
          Appointment.countDocuments({ patient: patient._id, status: 'completed' })
        ]);

        const recentAppointments = await Appointment.find({ patient: patient._id })
          .sort({ date: -1 })
          .limit(5);

        stats = {
          totalAppointments,
          upcomingAppointments,
          completedAppointments,
          recentAppointments
        };
      }
    }

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;

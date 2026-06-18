import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Please assign a department']
  },
  specialization: {
    type: String,
    required: [true, 'Please provide specialization'],
    trim: true
  },
  qualification: {
    type: String,
    required: [true, 'Please provide qualification'],
    trim: true
  },
  experience: {
    type: Number,
    required: [true, 'Please provide years of experience'],
    min: 0
  },
  fees: {
    type: Number,
    required: [true, 'Please provide consultation fees'],
    min: 0
  },
  availability: {
    days: {
      type: [String],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    startTime: {
      type: String,
      default: '09:00'
    },
    endTime: {
      type: String,
      default: '17:00'
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on-leave'],
    default: 'active'
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Populate user info by default
doctorSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name email phone avatar'
  }).populate({
    path: 'department',
    select: 'name'
  });
  next();
});

export default mongoose.model('Doctor', doctorSchema);

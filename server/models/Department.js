import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  head: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  icon: {
    type: String,
    default: '🏥'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field to count doctors in department
departmentSchema.virtual('doctorCount', {
  ref: 'Doctor',
  localField: '_id',
  foreignField: 'department',
  count: true
});

export default mongoose.model('Department', departmentSchema);

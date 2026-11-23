import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: {
      type: String,
      required: true
    },
    specialization: {
      type: String,
      required: true
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true
    },
    departmentName: {
      type: String,
      required: true
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true
    },
    phone: String,
    email: String,
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80'
    },
    experience: String,
    room: String,
    currentServingToken: {
      type: String,
      default: null
    },
    availability: [
      {
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        hours: {
          type: String,
          default: '09:00 AM - 05:00 PM'
        },
        available: {
          type: Boolean,
          default: true
        }
      }
    ]
  },
  { timestamps: true }
);

export const Doctor = mongoose.model('Doctor', DoctorSchema);

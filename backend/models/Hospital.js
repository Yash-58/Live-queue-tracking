import mongoose from 'mongoose';

const HospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true
    },
    code: {
      type: String,
      required: [true, 'Hospital unique code is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    beds: {
      type: Number,
      default: 100
    },
    address: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    // STRICT 1-TO-1 RELATIONSHIP: One Admin per Hospital
    assignedAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HospitalAdmin',
      unique: true,
      sparse: true // Allows null when hospital is unassigned
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Hospital = mongoose.model('Hospital', HospitalSchema);

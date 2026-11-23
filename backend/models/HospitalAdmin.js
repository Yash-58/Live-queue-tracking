import mongoose from 'mongoose';

const HospitalAdminSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true // 1 User can only have 1 HospitalAdmin profile
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true
    },
    // STRICT 1-TO-1 RELATIONSHIP: One Hospital per Admin
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
      unique: true // Guarantees this admin cannot be assigned to another hospital
    },
    hospitalName: {
      type: String,
      required: true
    },
    // ADMIN VERIFICATION LIFECYCLE
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected'],
      default: 'Pending' // Initial state on registration
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // Super Admin who verified
    },
    verifiedAt: {
      type: Date
    },
    rejectionReason: {
      type: String,
      default: null
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    }
  },
  { timestamps: true }
);

export const HospitalAdmin = mongoose.model('HospitalAdmin', HospitalAdminSchema);

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide user name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide user email'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'doctor', 'patient'],
      default: 'patient'
    },
    phone: {
      type: String,
      trim: true
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
    },
    // Reference to hospital if role is admin or doctor
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital'
    },
    // Patient demographic fields
    age: Number,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other']
    },
    bloodGroup: String,
    address: String,
    // Verification state for hospital administrators
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected', 'N/A'],
      default: 'N/A'
    }
  },
  { timestamps: true }
);

// Password hash hook
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', UserSchema);

import { User } from '../models/User.js';
import { HospitalAdmin } from '../models/HospitalAdmin.js';
import { generateToken } from '../middleware/auth.js';

// @desc    Register a new user (Patient or Hospital Admin)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, hospitalId, licenseNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const assignedRole = role || 'patient';
    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      phone,
      hospital: hospitalId || null,
      verificationStatus: assignedRole === 'admin' ? 'Pending' : 'N/A'
    });

    // If registering as a Hospital Admin, ensure Strict 1-to-1 Mapping
    if (assignedRole === 'admin') {
      if (!hospitalId) {
        return res.status(400).json({ success: false, message: 'Hospital ID is required for Hospital Admin' });
      }

      // Check if hospital is already assigned
      const existingAdminForHosp = await HospitalAdmin.findOne({ hospital: hospitalId });
      if (existingAdminForHosp) {
        return res.status(409).json({
          success: false,
          message: 'Strict 1-to-1 Mapping Violation: This hospital already has an assigned administrator'
        });
      }

      await HospitalAdmin.create({
        user: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || 'N/A',
        licenseNumber: licenseNumber || `LIC-${Date.now()}`,
        hospital: hospitalId,
        hospitalName: req.body.hospitalName || 'Associated Hospital',
        verificationStatus: 'Pending'
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        verificationStatus: user.verificationStatus
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check hospital admin verification status strictly
    let adminProfile = null;
    if (user.role === 'admin') {
      adminProfile = await HospitalAdmin.findOne({ user: user._id });
      if (adminProfile && adminProfile.verificationStatus !== 'Verified') {
        return res.status(403).json({
          success: false,
          status: adminProfile.verificationStatus,
          message: `ACCESS DENIED: Your hospital administrator account is currently ${adminProfile.verificationStatus}. Super Admin approval is required before logging in.`,
          rejectionReason: adminProfile.rejectionReason || null
        });
      }
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        hospital: user.hospital,
        verificationStatus: adminProfile ? adminProfile.verificationStatus : user.verificationStatus
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let adminProfile = null;

    if (user.role === 'admin') {
      adminProfile = await HospitalAdmin.findOne({ user: user._id }).populate('hospital');
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        hospital: adminProfile?.hospital || user.hospital,
        adminProfile
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

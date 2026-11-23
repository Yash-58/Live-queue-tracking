import { HospitalAdmin } from '../models/HospitalAdmin.js';

/**
 * Strict Verification Guard for Hospital Admins:
 * Blocks any hospital admin with 'Pending' or 'Rejected' status from accessing
 * their hospital's operational dashboard, doctors, departments, or queue controls.
 */
export const requireVerifiedAdmin = async (req, res, next) => {
  try {
    // If Super Admin, bypass hospital verification check
    if (req.user.role === 'super_admin') {
      return next();
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access restricted to Hospital Administrators only'
      });
    }

    const adminProfile = await HospitalAdmin.findOne({ user: req.user._id });

    if (!adminProfile) {
      return res.status(404).json({
        success: false,
        message: 'Hospital Administrator profile not found. Please contact Super Admin.'
      });
    }

    if (adminProfile.verificationStatus !== 'Verified') {
      return res.status(403).json({
        success: false,
        verified: false,
        status: adminProfile.verificationStatus,
        message: `Account is currently ${adminProfile.verificationStatus}. Full hospital dashboard access requires Super Admin approval.`,
        rejectionReason: adminProfile.rejectionReason || null
      });
    }

    // Attach verified hospital reference to request
    req.adminProfile = adminProfile;
    req.hospitalId = adminProfile.hospital;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error checking administrator verification status',
      error: error.message
    });
  }
};

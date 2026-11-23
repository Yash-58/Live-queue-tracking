import { Hospital } from '../models/Hospital.js';
import { HospitalAdmin } from '../models/HospitalAdmin.js';
import { User } from '../models/User.js';

// @desc    Get all registered hospitals & their assigned admins
// @route   GET /api/super-admin/hospitals
// @access  Super Admin only
export const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().populate('assignedAdmin');
    res.json({ success: true, count: hospitals.length, data: hospitals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create / Register a new hospital
// @route   POST /api/super-admin/hospitals
// @access  Super Admin only
export const createHospital = async (req, res) => {
  try {
    const { name, code, city, beds, address, phone } = req.body;

    const existingHosp = await Hospital.findOne({ code: code.toUpperCase() });
    if (existingHosp) {
      return res.status(400).json({ success: false, message: `Hospital code '${code}' already exists` });
    }

    const hospital = await Hospital.create({
      name,
      code: code.toUpperCase(),
      city,
      beds: beds || 100,
      address,
      phone
    });

    res.status(201).json({ success: true, data: hospital });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a hospital
// @route   DELETE /api/super-admin/hospitals/:id
// @access  Super Admin only
export const deleteHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }

    // Unlink any assigned admin
    if (hospital.assignedAdmin) {
      await HospitalAdmin.findByIdAndUpdate(hospital.assignedAdmin, {
        hospital: null,
        hospitalName: 'Unassigned'
      });
    }

    await hospital.deleteOne();
    res.json({ success: true, message: 'Hospital deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all Hospital Admins & verification states
// @route   GET /api/super-admin/admins
// @access  Super Admin only
export const getHospitalAdmins = async (req, res) => {
  try {
    const admins = await HospitalAdmin.find().populate('hospital').populate('verifiedBy', 'name email');
    res.json({ success: true, count: admins.length, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign an admin to a hospital with STRICT 1-TO-1 MAPPING RULES
// @route   POST /api/super-admin/assign-admin
// @access  Super Admin only
export const assignAdminToHospital = async (req, res) => {
  try {
    const { hospitalId, name, email, phone, licenseNumber, password } = req.body;

    // 1. Validate hospital exists
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Target hospital not found' });
    }

    // 2. Strict 1-to-1 Constraint Check 1: Hospital must not already have an assigned admin
    if (hospital.assignedAdmin) {
      return res.status(409).json({
        success: false,
        message: 'Strict 1-to-1 Mapping Violation: This hospital already has an assigned administrator'
      });
    }

    // 3. Strict 1-to-1 Constraint Check 2: Admin user email must not already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // 4. Create User account
    const user = await User.create({
      name,
      email,
      password: password || 'HospitalAdmin@123',
      role: 'admin',
      phone,
      hospital: hospital._id,
      verificationStatus: 'Pending'
    });

    // 5. Create HospitalAdmin profile with initial Pending status
    const admin = await HospitalAdmin.create({
      user: user._id,
      name,
      email,
      phone,
      licenseNumber: licenseNumber || `HA-${Date.now()}`,
      hospital: hospital._id,
      hospitalName: hospital.name,
      verificationStatus: 'Pending'
    });

    // 6. Link back to hospital
    hospital.assignedAdmin = admin._id;
    await hospital.save();

    res.status(201).json({
      success: true,
      message: 'Administrator successfully registered in Pending status under strict 1-to-1 mapping',
      data: admin
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Unassign an admin from a hospital
// @route   POST /api/super-admin/unassign-admin/:adminId
// @access  Super Admin only
export const unassignAdmin = async (req, res) => {
  try {
    const admin = await HospitalAdmin.findById(req.params.adminId);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Administrator not found' });
    }

    if (admin.hospital) {
      await Hospital.findByIdAndUpdate(admin.hospital, { assignedAdmin: null });
    }

    await admin.deleteOne();
    await User.findByIdAndDelete(admin.user);

    res.json({ success: true, message: 'Admin unassigned and account deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve / Verify Hospital Admin
// @route   PUT /api/super-admin/admins/:id/verify
// @access  Super Admin only
export const verifyHospitalAdmin = async (req, res) => {
  try {
    const admin = await HospitalAdmin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Administrator not found' });
    }

    admin.verificationStatus = 'Verified';
    admin.verifiedBy = req.user._id;
    admin.verifiedAt = new Date();
    admin.rejectionReason = null;
    await admin.save();

    // Update user record
    await User.findByIdAndUpdate(admin.user, { verificationStatus: 'Verified' });

    res.json({
      success: true,
      message: `Administrator ${admin.name} has been verified and granted OPD privileges.`,
      data: admin
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject Hospital Admin
// @route   PUT /api/super-admin/admins/:id/reject
// @access  Super Admin only
export const rejectHospitalAdmin = async (req, res) => {
  try {
    const { reason } = req.body;
    const admin = await HospitalAdmin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Administrator not found' });
    }

    admin.verificationStatus = 'Rejected';
    admin.rejectionReason = reason || 'Documentation incomplete or unverified';
    await admin.save();

    await User.findByIdAndUpdate(admin.user, { verificationStatus: 'Rejected' });

    res.json({
      success: true,
      message: `Administrator ${admin.name} verification has been rejected.`,
      data: admin
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

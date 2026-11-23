import { Doctor } from '../models/Doctor.js';
import { Department } from '../models/Department.js';
import { Appointment } from '../models/Appointment.js';
import { User } from '../models/User.js';

// @desc    Get Hospital Overview & Analytics
// @route   GET /api/admin/overview
// @access  Verified Hospital Admin only
export const getHospitalOverview = async (req, res) => {
  try {
    const hospitalId = req.hospitalId;

    const [totalDoctors, totalDepartments, totalAppointments, waitingAppointments] = await Promise.all([
      Doctor.countDocuments({ hospital: hospitalId }),
      Department.countDocuments({ hospital: hospitalId }),
      Appointment.countDocuments({ hospital: hospitalId }),
      Appointment.countDocuments({ hospital: hospitalId, status: 'Waiting' })
    ]);

    res.json({
      success: true,
      data: {
        totalDoctors,
        totalDepartments,
        totalAppointments,
        waitingAppointments,
        completedAppointments: await Appointment.countDocuments({ hospital: hospitalId, status: 'Completed' }),
        avgWaitMins: 22
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Doctors in this Hospital
// @route   GET /api/admin/doctors
// @access  Verified Hospital Admin only
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ hospital: req.hospitalId }).populate('department');
    res.json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add Doctor
// @route   POST /api/admin/doctors
// @access  Verified Hospital Admin only
export const addDoctor = async (req, res) => {
  try {
    const { name, specialization, departmentId, phone, email, password, room, experience } = req.body;

    const dept = await Department.findById(departmentId);
    if (!dept) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    // Create User login credentials for Doctor with password assigned by Admin
    let user = null;
    if (email) {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        user = await User.create({
          name,
          email,
          password: password || 'Doctor@123',
          role: 'doctor',
          phone,
          hospital: req.hospitalId
        });
      } else {
        user = existingUser;
      }
    }

    const doctor = await Doctor.create({
      user: user?._id || null,
      name,
      specialization,
      department: dept._id,
      departmentName: dept.name,
      hospital: req.hospitalId,
      phone,
      email,
      room: room || 'Room 101',
      experience: experience || '5+ Years'
    });

    res.status(201).json({
      success: true,
      message: 'Doctor created with login credentials for Doctor Portal',
      data: doctor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Doctor
// @route   DELETE /api/admin/doctors/:id
// @access  Verified Hospital Admin only
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndDelete({ _id: req.params.id, hospital: req.hospitalId });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Departments
// @route   GET /api/admin/departments
// @access  Verified Hospital Admin only
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ hospital: req.hospitalId });
    res.json({ success: true, count: departments.length, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add Department
// @route   POST /api/admin/departments
// @access  Verified Hospital Admin only
export const addDepartment = async (req, res) => {
  try {
    const { name, head, floor, icon, description } = req.body;
    const department = await Department.create({
      name,
      hospital: req.hospitalId,
      head: head || 'Dr. Specialist',
      floor: floor || '1st Floor',
      icon: icon || 'HeartPulse',
      description: description || 'Specialized department'
    });
    res.status(201).json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Department
// @route   DELETE /api/admin/departments/:id
// @access  Verified Hospital Admin only
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findOneAndDelete({ _id: req.params.id, hospital: req.hospitalId });
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    res.json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Hospital Appointments
// @route   GET /api/admin/appointments
// @access  Verified Hospital Admin only
export const getAppointments = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { hospital: req.hospitalId };
    if (status && status !== 'All') {
      query.status = status;
    }
    const appointments = await Appointment.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Hospital Registered Patients
// @route   GET /api/admin/patients
// @access  Verified Hospital Admin only
export const getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password');
    res.json({ success: true, count: patients.length, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

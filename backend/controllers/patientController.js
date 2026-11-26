import { Appointment } from '../models/Appointment.js';
import { Doctor } from '../models/Doctor.js';
import { Department } from '../models/Department.js';
import { Notification } from '../models/Notification.js';
import { Hospital } from '../models/Hospital.js';
import { User } from '../models/User.js';

// @desc    Book an appointment & automatically generate sequential digital token
// @route   POST /api/patient/appointments
// @access  Patient
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, departmentId, date, timeSlot, reason } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    const department = await Department.findById(departmentId);
    if (!department) return res.status(404).json({ success: false, message: 'Department not found' });

    // Generate unique sequential token (e.g. A-25)
    const countToday = await Appointment.countDocuments({
      doctor: doctor._id,
      date
    });
    const prefix = department.name.charAt(0).toUpperCase();
    const tokenNumber = `${prefix}-${countToday + 1}`;

    const appointment = await Appointment.create({
      tokenNumber,
      patient: req.user._id,
      patientName: req.user.name,
      patientPhone: req.user.phone || '+91 98765 43210',
      patientAge: req.user.age || 28,
      patientGender: req.user.gender || 'Male',
      doctor: doctor._id,
      doctorName: doctor.name,
      department: department._id,
      departmentName: department.name,
      hospital: doctor.hospital,
      hospitalName: req.body.hospitalName || 'City Care Hospital',
      date,
      timeSlot,
      reason: reason || 'Routine Checkup',
      status: 'Waiting',
      estimatedWaitMins: (countToday + 1) * 8
    });

    // Create Notification
    await Notification.create({
      user: req.user._id,
      title: `Token Generated: ${tokenNumber}`,
      message: `Your appointment with ${doctor.name} is confirmed for ${date} at ${timeSlot}. Token: ${tokenNumber}`,
      type: 'token'
    });

    res.status(201).json({
      success: true,
      message: `Appointment booked successfully! Digital Token: ${tokenNumber}`,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get patient's appointments
// @route   GET /api/patient/appointments
// @access  Patient
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel an appointment
// @route   PUT /api/patient/appointments/:id/cancel
// @access  Patient
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, patient: req.user._id });
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    await Notification.create({
      user: req.user._id,
      title: 'Appointment Cancelled',
      message: `Your appointment ${appointment.tokenNumber} with ${appointment.doctorName} was cancelled.`,
      type: 'system'
    });

    res.json({ success: true, message: 'Appointment cancelled successfully', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get patient notifications
// @route   GET /api/patient/notifications
// @access  Patient
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: notifications.length, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all registered network hospitals for patients
// @route   GET /api/patient/hospitals
// @access  Public / Patient
export const getRegisteredHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({ status: 'Active' });
    res.json({ success: true, count: hospitals.length, data: hospitals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update patient profile details
// @route   PUT /api/patient/profile
// @access  Patient
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, phone, age, gender, bloodGroup, address, emergencyContact, allergies, medicalHistory } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (bloodGroup) user.bloodGroup = bloodGroup;
    if (address) user.address = address;
    if (emergencyContact) user.emergencyContact = emergencyContact;
    if (allergies) user.allergies = allergies;
    if (medicalHistory) user.medicalHistory = medicalHistory;

    await user.save();
    res.json({ success: true, message: 'Profile updated successfully', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

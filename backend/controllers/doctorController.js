import { Appointment } from '../models/Appointment.js';
import { Doctor } from '../models/Doctor.js';

// @desc    Get Doctor's Today Queue & Stats
// @route   GET /api/doctor/queue
// @access  Doctor
export const getDoctorQueue = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id }) || await Doctor.findOne();
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    const appointments = await Appointment.find({ doctor: doctor._id }).sort({ createdAt: 1 });
    const waiting = appointments.filter(a => a.status === 'Waiting');
    const completed = appointments.filter(a => a.status === 'Completed');
    const inConsultation = appointments.find(a => a.status === 'In Consultation');

    res.json({
      success: true,
      data: {
        doctor,
        stats: {
          totalPatients: appointments.length,
          completed: completed.length,
          waiting: waiting.length,
          avgTime: '8 mins'
        },
        currentlyServing: inConsultation || null,
        queue: waiting,
        appointments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Call / Start consultation with patient
// @route   PUT /api/doctor/appointments/:id/start
// @access  Doctor
export const startConsultation = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = 'In Consultation';
    await appointment.save();

    await Doctor.findByIdAndUpdate(appointment.doctor, {
      currentServingToken: appointment.tokenNumber
    });

    res.json({ success: true, message: `Now consulting token ${appointment.tokenNumber}`, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Complete consultation
// @route   PUT /api/doctor/appointments/:id/complete
// @access  Doctor
export const completeConsultation = async (req, res) => {
  try {
    const { doctorNotes } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = 'Completed';
    if (doctorNotes) appointment.doctorNotes = doctorNotes;
    await appointment.save();

    await Doctor.findByIdAndUpdate(appointment.doctor, {
      currentServingToken: null
    });

    res.json({ success: true, message: 'Consultation completed successfully', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Skip patient
// @route   PUT /api/doctor/appointments/:id/skip
// @access  Doctor
export const skipPatient = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = 'Skipped';
    await appointment.save();

    res.json({ success: true, message: `Patient token ${appointment.tokenNumber} skipped`, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Doctor Weekly Availability
// @route   PUT /api/doctor/availability
// @access  Doctor
export const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user._id },
      { availability },
      { new: true }
    );
    res.json({ success: true, message: 'Availability schedule saved', data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

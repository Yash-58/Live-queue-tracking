import { Appointment } from '../models/Appointment.js';
import { Doctor } from '../models/Doctor.js';

// @desc    Get live real-time queue tracking for department/doctor
// @route   GET /api/queue/live
// @access  Public
export const getLiveQueue = async (req, res) => {
  try {
    const { doctorId, departmentId, hospitalId } = req.query;

    const query = { status: { $in: ['Waiting', 'In Consultation'] } };
    if (doctorId) query.doctor = doctorId;
    if (departmentId) query.department = departmentId;
    if (hospitalId) query.hospital = hospitalId;

    const activeList = await Appointment.find(query).sort({ createdAt: 1 });

    const currentlyServing = activeList.find(a => a.status === 'In Consultation');
    const waitingQueue = activeList.filter(a => a.status === 'Waiting');

    res.json({
      success: true,
      data: {
        currentlyServing: currentlyServing
          ? {
              token: currentlyServing.tokenNumber,
              patientName: currentlyServing.patientName,
              doctorName: currentlyServing.doctorName,
              department: currentlyServing.departmentName
            }
          : { token: 'None', patientName: 'Waiting to start' },
        peopleAhead: waitingQueue.length,
        estimatedWaitTime: `${waitingQueue.length * 8} mins`,
        liveQueue: waitingQueue.map(item => ({
          token: item.tokenNumber,
          patientName: item.patientName,
          status: item.status,
          priority: item.priority
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

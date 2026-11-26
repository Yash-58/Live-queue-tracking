import express from 'express';
import {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  getNotifications,
  getRegisteredHospitals,
  updateProfile
} from '../controllers/patientController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public route to view registered hospitals
router.get('/hospitals', getRegisteredHospitals);

router.use(protect);

router.post('/appointments', bookAppointment);
router.get('/appointments', getMyAppointments);
router.put('/appointments/:id/cancel', cancelAppointment);
router.get('/notifications', getNotifications);
router.put('/profile', updateProfile);

export default router;

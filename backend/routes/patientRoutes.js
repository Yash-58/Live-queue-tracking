import express from 'express';
import {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  getNotifications
} from '../controllers/patientController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/appointments', bookAppointment);
router.get('/appointments', getMyAppointments);
router.put('/appointments/:id/cancel', cancelAppointment);
router.get('/notifications', getNotifications);

export default router;

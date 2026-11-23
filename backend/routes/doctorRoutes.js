import express from 'express';
import {
  getDoctorQueue,
  startConsultation,
  completeConsultation,
  skipPatient,
  updateAvailability
} from '../controllers/doctorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('doctor', 'admin', 'super_admin'));

router.get('/queue', getDoctorQueue);
router.put('/appointments/:id/start', startConsultation);
router.put('/appointments/:id/complete', completeConsultation);
router.put('/appointments/:id/skip', skipPatient);
router.put('/availability', updateAvailability);

export default router;

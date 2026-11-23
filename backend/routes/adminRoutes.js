import express from 'express';
import {
  getHospitalOverview,
  getDoctors,
  addDoctor,
  deleteDoctor,
  getDepartments,
  addDepartment,
  deleteDepartment,
  getAppointments,
  getPatients
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { requireVerifiedAdmin } from '../middleware/verifyAdmin.js';

const router = express.Router();

// Strict Verification & Role Protection:
// Requires authenticated Hospital Admin AND verificationStatus === 'Verified'
router.use(protect);
router.use(authorize('admin', 'super_admin'));
router.use(requireVerifiedAdmin);

router.get('/overview', getHospitalOverview);

router.get('/doctors', getDoctors);
router.post('/doctors', addDoctor);
router.delete('/doctors/:id', deleteDoctor);

router.get('/departments', getDepartments);
router.post('/departments', addDepartment);
router.delete('/departments/:id', deleteDepartment);

router.get('/appointments', getAppointments);
router.get('/patients', getPatients);

export default router;

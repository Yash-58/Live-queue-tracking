import express from 'express';
import {
  getHospitals,
  createHospital,
  deleteHospital,
  getHospitalAdmins,
  assignAdminToHospital,
  unassignAdmin,
  verifyHospitalAdmin,
  rejectHospitalAdmin
} from '../controllers/superAdminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes here strictly require super_admin role
router.use(protect);
router.use(authorize('super_admin'));

router.get('/hospitals', getHospitals);
router.post('/hospitals', createHospital);
router.delete('/hospitals/:id', deleteHospital);

router.get('/admins', getHospitalAdmins);
router.post('/assign-admin', assignAdminToHospital);
router.post('/unassign-admin/:adminId', unassignAdmin);
router.put('/admins/:id/verify', verifyHospitalAdmin);
router.put('/admins/:id/reject', rejectHospitalAdmin);

export default router;

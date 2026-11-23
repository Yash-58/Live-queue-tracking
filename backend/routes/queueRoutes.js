import express from 'express';
import { getLiveQueue } from '../controllers/queueController.js';

const router = express.Router();

router.get('/live', getLiveQueue);

export default router;

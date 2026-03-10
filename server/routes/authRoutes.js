import express from 'express';
import { syncUser } from '../controllers/authController.js';

const router = express.Router();

// Route to sync Firebase user to MongoDB
router.post('/sync', syncUser);

export default router;

import express from 'express';
import { getPets, addPet } from '../controllers/petController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getPets).post(protect, addPet);

export default router;

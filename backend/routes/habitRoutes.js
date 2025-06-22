import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
    createHabit,
    getHabitsByUser,
    getHabitById,
    updateHabit,
    deleteHabit,
    completeHabit
} from '../controllers/habitController.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Habit routes
router.post('/', createHabit);
router.get('/user', getHabitsByUser);
router.get('/:id', getHabitById);
router.put('/:id', updateHabit);
router.delete('/:id', deleteHabit);
router.post('/:id/complete', completeHabit);

export default router; 
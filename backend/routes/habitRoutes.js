import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
    createHabit,
    getHabitsByUser,
    getHabitById,
    updateHabit,
    deleteHabit
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

export default router; 
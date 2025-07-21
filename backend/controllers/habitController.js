import Habit from '../models/Habit.js';
import User from '../models/User.js';

// Create a new habit
export const createHabit = async (req, res) => {
    try {
        const habit = new Habit({
            ...req.body,
            user: req.user._id
        });

        await habit.save();
        res.status(201).json(habit);
    } catch (error) {
        console.error('Error creating habit:', error);
        res.status(400).json({ message: error.message });
    }
};

// Get all habits for a user
export const getHabitsByUser = async (req, res) => {
    try {
        const habits = await Habit.find({ user: req.user._id });
        res.json(habits);
    } catch (error) {
        console.error('Error fetching habits:', error);
        res.status(400).json({ message: error.message });
    }
};

// Get a habit by ID
export const getHabitById = async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // Check if the habit belongs to the authenticated user
        if (habit.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(habit);
    } catch (error) {
        console.error('Error fetching habit:', error);
        res.status(400).json({ message: error.message });
    }
};

// Update a habit
export const updateHabit = async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // Check if the habit belongs to the authenticated user
        if (habit.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const updatedHabit = await Habit.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedHabit);
    } catch (error) {
        console.error('Error updating habit:', error);
        res.status(400).json({ message: error.message });
    }
};

// Delete a habit
export const deleteHabit = async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // Check if the habit belongs to the authenticated user
        if (habit.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }

        await Habit.findByIdAndDelete(req.params.id);
        res.json({ message: 'Habit deleted' });
    } catch (error) {
        console.error('Error deleting habit:', error);
        res.status(400).json({ message: error.message });
    }
};

// Complete a habit (mark as completed and award experience)
export const completeHabit = async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }
        // Check if the habit belongs to the authenticated user
        if (habit.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }
        // --- User-wide Streak Logic ---
        const user = await User.findById(req.user._id);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        let streak = user.currentStreak || 0;
        let longestStreak = user.longestStreak || 0;
        let lastCompleted = user.lastCompletedDate ? new Date(user.lastCompletedDate) : null;
        if (lastCompleted) lastCompleted.setHours(0, 0, 0, 0);
        if (lastCompleted && lastCompleted.getTime() === yesterday.getTime()) {
            streak += 1;
        } else if (!lastCompleted || lastCompleted.getTime() !== today.getTime()) {
            streak = 1;
        }
        // Only update longestStreak if a new record is set
        if (streak > longestStreak) {
            longestStreak = streak;
        }
        user.currentStreak = streak;
        user.longestStreak = longestStreak;
        user.lastCompletedDate = today;
        // --- Experience Bonus ---
        const baseXP = habit.experiencePoints || 10;
        // 10% bonus per streak day, capped at 2x base XP
        const bonusMultiplier = Math.min(1 + 0.1 * (streak - 1), 2);
        const xpGained = Math.round(baseXP * bonusMultiplier);
        await user.addExperience(xpGained);
        await user.save();
        // Delete the habit from the database
        await Habit.findByIdAndDelete(req.params.id);
        res.json({
            message: 'Habit completed and deleted',
            user,
            streak: {
                currentStreak: user.currentStreak,
                longestStreak: user.longestStreak,
                lastCompletedDate: user.lastCompletedDate,
                xpGained
            }
        });
    } catch (error) {
        console.error('Error completing habit:', error);
        res.status(400).json({ message: error.message });
    }
}; 
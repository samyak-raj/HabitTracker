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

// Complete a habit
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

        // Add today's progress
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of day

        // Check if there's already a progress entry for today
        const existingProgress = habit.progress.find(p => {
            const progressDate = new Date(p.date);
            progressDate.setHours(0, 0, 0, 0);
            return progressDate.getTime() === today.getTime();
        });

        if (existingProgress) {
            existingProgress.completed = true;
        } else {
            habit.progress.push({
                date: today,
                completed: true,
                value: 1
            });
        }

        await habit.save();
        res.json(habit);
    } catch (error) {
        console.error('Error completing habit:', error);
        res.status(400).json({ message: error.message });
    }
}; 
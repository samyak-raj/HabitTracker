import Habit from '../models/Habit.js';

// Create a new habit
export const createHabit = async (req, res) => {
    const { user, title, description, category, frequency, target, unit, experiencePoints, status } = req.body;
    const habit = new Habit({ user, title, description, category, frequency, target, unit, experiencePoints, status });
    await habit.save();
    res.status(201).json(habit);
};

// Get all habits for a user
export const getHabitsByUser = async (req, res) => {
    const habits = await Habit.find({ user: req.params.userId });
    res.json(habits);
};

// Get a habit by ID
export const getHabitById = async (req, res) => {
    const habit = await Habit.findById(req.params.id);
    if (!habit) throw new Error('Habit not found');
    res.json(habit);
};

// Update a habit
export const updateHabit = async (req, res) => {
    const habit = await Habit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!habit) throw new Error('Habit not found');
    res.json(habit);
};

// Delete a habit
export const deleteHabit = async (req, res) => {
    const habit = await Habit.findByIdAndDelete(req.params.id);
    if (!habit) throw new Error('Habit not found');
    res.json({ message: 'Habit deleted' });
}; 
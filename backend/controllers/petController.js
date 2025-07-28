import Pet from '../models/Pet.js';

// @desc    Get all pets
// @route   GET /api/pets
// @access  Public
const getPets = async (req, res) => {
    try {
        const pets = await Pet.find({});
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export { getPets };

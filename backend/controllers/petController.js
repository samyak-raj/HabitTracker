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

// @desc    Add a new pet
// @route   POST /api/pets
// @access  Private
const addPet = async (req, res) => {
    try {
        const { name, image, description, cost } = req.body;

        const pet = new Pet({
            name,
            image,
            description,
            cost,
        });

        const createdPet = await pet.save();
        res.status(201).json(createdPet);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export { getPets, addPet };

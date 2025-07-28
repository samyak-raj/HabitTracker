
import Pet from '../models/Pet.js';
import User from '../models/User.js';

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
// @desc    Update a pet
// @route   PUT /api/pets/:id
// @access  Public
const updatePet = async (req, res) => {
    try {
        const updates = {};
        const { name, image, description, cost } = req.body;

        // Only include fields that are defined in the update object
        if (name !== undefined) updates.name = name;
        if (image !== undefined) updates.image = image;
        if (description !== undefined) updates.description = description;
        if (cost !== undefined) updates.cost = cost;
        const updatedPet = await Pet.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true } // `new: true` returns the updated document
        ); 
        if (!updatedPet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        res.status(200).json(updatedPet);   
    } catch (error) {
        res.status(500).json({ message: 'Server error' , error: error});
    }
};
// @desc    Delete a pet
// @route   DELETE /api/pets/:id
// @access  Public
const deletePet = async (req, res) => {
        try {
        const pet = await Pet.findByIdAndDelete(req.params.id);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.status(200).json({ message: 'Pet removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error });
    }
};

const buyPet = async (req, res) => {
    try {
        const { petId } = req.body;
        const userId = req.user._id;

        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.pets.includes(petId)) {
            return res.status(400).json({ message: 'You already own this pet' });
        }

        if (user.coins < pet.cost) {
            return res.status(400).json({ message: 'Not enough coins' });
        }

        user.coins -= pet.cost;
        user.pets.push(petId);

        await user.save();

        res.status(200).json({ message: 'Pet purchased successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error });
    }
};

export { getPets, addPet, updatePet, deletePet, buyPet };

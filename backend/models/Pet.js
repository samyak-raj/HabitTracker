import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    cost: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

const Pet = mongoose.model('Pet', petSchema);

export default Pet;

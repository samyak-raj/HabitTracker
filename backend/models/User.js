import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    profilePicture: {
        type: String,
    },
    level: {
        type: Number,
        default: 1,
    },
    experience: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
});

// Virtual for experience needed for next level
userSchema.virtual('experienceToNextLevel').get(function () {
    return Math.floor(100 * Math.pow(1.5, this.level - 1));
});

// Method to add experience
userSchema.methods.addExperience = function (amount) {
    this.experience += amount;

    // Check for level up
    while (this.experience >= this.experienceToNextLevel) {
        this.experience -= this.experienceToNextLevel;
        this.level += 1;
    }

    return this.save();
};

const User = mongoose.model('User', userSchema);

export default User; 
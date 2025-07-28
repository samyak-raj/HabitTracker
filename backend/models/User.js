import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    googleId: {
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
    },
    // Streak tracking fields (user-wide)
    currentStreak: {
        type: Number,
        default: 0,
    },
    longestStreak: {
        type: Number,
        default: 0,
    },
    lastCompletedDate: {
        type: Date,
        default: null,
    },
    coins: {
        type: Number,
        default: 0,
    },
    pets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
    }],
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
        const requiredXP = this.experienceToNextLevel; // Store before incrementing level
        this.experience -= requiredXP;
        this.level += 1;
    }

    return this.save();
};

const User = mongoose.model('User', userSchema);

export default User; 
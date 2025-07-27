import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    category: {
        type: String,
        enum: ['health', 'fitness', 'learning', 'productivity', 'mindfulness', 'other'],
        default: 'other',
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'easy',
        required: true,
    },
    experiencePoints: {
        type: Number,
        // Will be set automatically based on difficulty
    },
    coins: {
        type: Number,
        // Will be set automatically based on difficulty
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active',
    },
    progress: [{
        date: {
            type: Date,
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        value: {
            type: Number,
            default: 0,
        },
        notes: String,
    }],
}, {
    timestamps: true,
});

// Add pre-save hook to set experiencePoints and coins based on difficulty
habitSchema.pre('save', function (next) {
    if (this.isModified('difficulty') || this.isNew) {
        switch (this.difficulty) {
            case 'easy':
                this.experiencePoints = 10;
                this.coins = 10;
                break;
            case 'medium':
                this.experiencePoints = 20;
                this.coins = 20;
                break;
            case 'hard':
                this.experiencePoints = 30;
                this.coins = 30;
                break;
            default:
                this.experiencePoints = 10;
                this.coins = 10;
        }
    }
    next();
});

const Habit = mongoose.model('Habit', habitSchema);

export default Habit; 
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

// Method to update progress
habitSchema.methods.updateProgress = async function (date, value, notes = '') {
    const progressEntry = {
        date: new Date(date),
        completed: value >= this.target,
        value,
        notes,
    };

    this.progress.push(progressEntry);
    return this.save();
};

// Method to get completion rate
habitSchema.methods.getCompletionRate = function () {
    if (this.progress.length === 0) return 0;
    const completed = this.progress.filter(p => p.completed).length;
    return (completed / this.progress.length) * 100;
};

// Static method to find habits by user
habitSchema.statics.findByUser = function (userId) {
    return this.find({ user: userId }).sort({ createdAt: -1 });
};

// Add pre-save hook to set experiencePoints based on difficulty
habitSchema.pre('save', function (next) {
    if (this.isModified('difficulty') || this.isNew) {
        switch (this.difficulty) {
            case 'easy':
                this.experiencePoints = 10;
                break;
            case 'medium':
                this.experiencePoints = 20;
                break;
            case 'hard':
                this.experiencePoints = 30;
                break;
            default:
                this.experiencePoints = 10;
        }
    }
    next();
});

const Habit = mongoose.model('Habit', habitSchema);

export default Habit; 